import React, { useEffect, useState } from "react";
import Table from "../../components/Table";
import Pagination from "../../components/Pagination";
import AddNewBin from "./AddNewBin";
import EditBins from "./EditBins";
import axios from "axios";
import { API } from "../../../const";
import { toast } from "react-toastify";
import { HiOutlineTrash } from "react-icons/hi";
import { useOutletContext, useSearchParams } from "react-router";

const Bins = () => {
  const [searchParams] = useSearchParams();
  const { searchTerm } = useOutletContext();

  const [binData, setBinData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalItems, setTotalItems] = useState(0);

  const itemsPerPage = 9;
  const filter = searchParams.get("filter") || "all";

  // 🔹 IST DATE FORMAT
  const formatISTDateTimeManual = (utcDate) => {
    if (!utcDate) return "-";
    const date = new Date(utcDate);
    date.setHours(date.getHours() - 5);
    date.setMinutes(date.getMinutes() - 30);
    return date.toLocaleString("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    });
  };

  // 🔹 FETCH BINS (SERVER SIDE SEARCH + PAGINATION)
  const fetchBins = async (page = 1) => {
    try {
      setLoading(true);

      const res = await axios.get(`${API}/bins/getallbins`, {
        params: {
          filter,
          page,
          limit: itemsPerPage,
          search: searchTerm,
        },
      });

      const formatted = res.data.data.map((bin) => ({
        ...bin,
        lastReportedAt: formatISTDateTimeManual(bin.lastReportedAt),
      }));

      setBinData(formatted);
      setTotalItems(res.data.totalItems);
      setCurrentPage(res.data.currentPage);
    } catch (err) {
      toast.error("Failed to fetch bins");
    } finally {
      setLoading(false);
    }
  };

  // 🔹 FILTER OR SEARCH CHANGE
  useEffect(() => {
    setCurrentPage(1);
    fetchBins(1);
  }, [filter, searchTerm]);

  // 🔹 PAGE CHANGE
  useEffect(() => {
    fetchBins(currentPage);
  }, [currentPage]);

  // 🔹 DELETE BIN
  const handleDeleteBin = async (id) => {
    if (!window.confirm("Are you sure?")) return;
    try {
      await axios.delete(`${API}/bins/deletebinbyid/${id}`);
      toast.success("Bin deleted");
      fetchBins(currentPage);
    } catch (err) {
      toast.error("Delete failed");
    }
  };

  const Columns = [
    { label: "Location ID", key: "binid" },
    { label: "Zone", key: "zone" },
    { label: "Ward", key: "ward" },
    { label: "Location", key: "location" },
    { label: "Filled%", key: "filled" },
    { label: "TCC", key: "totalClearedEvents" },
    { label: "Last Updated", key: "lastReportedAt" },
    { label: "Status", key: "status" },
  ];

  return (
    <>
      <Table
        title="Bins"
        sub_title="Table"
        pagetitle="Bins"
        colomns={Columns}
        itemsPerPage={itemsPerPage}
        currentPage={currentPage}
        tabledata={binData}
        loading={loading}
        addButtonLabel="Add New Bin"
        addButtonIcon={<HiOutlineTrash size={22} />}
        onDelete={handleDeleteBin}
        AddModal={(props) => (
          <AddNewBin
            {...props}
            onclose={() => {
              props.onclose();
              fetchBins(currentPage);
            }}
          />
        )}
        EditModal={EditBins}
        routepoint="viewlocation"
        ViewModel
      />

      <Pagination
        totalItems={totalItems}
        itemsPerPage={itemsPerPage}
        currentPage={currentPage}
        setCurrentPage={setCurrentPage}
      />
    </>
  );
};

export default Bins;
