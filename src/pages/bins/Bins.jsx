import React, { useEffect, useState } from "react";
import Table from "../../components/Table";
import { HiOutlineTrash } from "react-icons/hi";
import AddNewBin from "./AddNewBin";
import EditBins from "./EditBins";
import Pagination from "../../components/Pagination";
import axios from "axios";
import { API } from "../../../const";
import { toast } from "react-toastify";

const Bins = () => {
  const [binData, setBinData] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const [loading, setLoading] = useState(false);

  const itemsPerPage = 9;

  // ✅ IST Formatter
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

  // ✅ Fetch bins
  const fetchBins = async (page = 1) => {
    try {
      setLoading(true);
      const res = await axios.get(
        `${API}/bins/getallbins?page=${page}&limit=${itemsPerPage}`
      );

      const formatted = res.data.data.map((bin) => ({
        ...bin,
        lastReportedAt: formatISTDateTimeManual(bin.lastReportedAt),
      }));

      setBinData(formatted);
      setTotalItems(res.data.totalItems);
      setCurrentPage(res.data.currentPage);
    } catch (err) {
      console.error("Fetch bins error", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBins(currentPage);
  }, [currentPage]);

  // ✅ Delete bin
  const handleDeleteBin = async (id) => {
    if (!window.confirm("Are you sure you want to delete this bin?")) return;

    try {
      await axios.delete(`${API}/bins/deletebinbyid/${id}`);
      toast.success("Bin deleted successfully");
      fetchBins(currentPage); // 🔥 important
    } catch (err) {
      toast.error("Failed to delete bin");
    }
  };

  const Columns = [
    { label: "Location ID", key: "binid" },
    { label: "Zone", key: "zone" },
    { label: "Ward", key: "ward" },
    { label: "Location", key: "location" },
    { label: "Filled %", key: "filled" },
    { label: "Last Updated", key: "lastReportedAt" },
    { label: "TCC", key: "totalClearedEvents" },
    { label: "Status", key: "status" },
  ];

  return (
    <div>
      <Table
        title="Bins"
        sub_title="Table"
        pagetitle="Bins"
        addButtonLabel="Add New Location"
        addButtonIcon={<HiOutlineTrash size={22} />}
        colomns={Columns}
        tabledata={binData}
        onDelete={handleDeleteBin}
        loading={loading}
        EditModal={EditBins}
        ViewModel={true}
        routepoint="viewlocation"
        AddModal={(modalProps) => (
          <AddNewBin
            {...modalProps}
            onclose={() => {
              modalProps.onclose();
              fetchBins(currentPage);
            }}
          />
        )}
      />

      <Pagination
        totalItems={totalItems}
        itemsPerPage={itemsPerPage}
        currentPage={currentPage}
        setCurrentPage={setCurrentPage}
      />
    </div>
  );
};

export default Bins;
