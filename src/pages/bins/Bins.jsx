import React, { useEffect, useState } from "react";
import Table from "../../components/Table";
import { HiOutlineTrash } from "react-icons/hi";
import AddNewBin from "./AddNewBin";
import axios from "axios";
import { API } from "../../../const";
import { toast } from "react-toastify";
import EditBins from "./EditBins";
import Pagination from "../../components/Pagination";

const Bins = () => {
  const [binData, setBinData] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [totalItems, setTotalItems] = useState(0);
  const itemsPerPage = 9;
  // 1️⃣ Fetch bins from backend
  // -----------------------
 


  const fetchbins = async (page = 1) => {
    try {
      setLoading(true);

      const res = await axios.get(
        `${API}/bins/getallbins?page=${page}&limit=${itemsPerPage}`,
      );

      const formattedData = res.data.data.map((bin) => ({
        ...bin,
        lastReportedAt: bin.lastReportedAt
          ? new Date(bin.lastReportedAt).toLocaleString("en-IN", {
              day: "2-digit",
              month: "short",
              year: "numeric",
              hour: "2-digit",
              minute: "2-digit",
              hour12: true,
            })
          : "-",
      }));
     
      setBinData(formattedData);
      setTotalItems(res.data.pagination.totalItems);
      setCurrentPage(res.data.pagination.currentPage);
    } catch (error) {
      console.log("Bin Fetch Error:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchbins(currentPage);
  }, [currentPage]);
 
 console.log("Bin Data:", binData);
 
  // -----------------------
  // 3️⃣ Delete a bin
  // -----------------------
  const handleDeleteBin = async (id) => {
    if (!window.confirm("Are you sure you want to delete this bin?")) return;

    try {
      await axios.delete(`${API}/bins/deletebinbyid/${id}`);
      toast.success("Bin deleted successfully");

      // 🧠 last item on page logic
      if (binData.length === 1 && currentPage > 1) {
        setCurrentPage((prev) => prev - 1);
      } else {
        fetchbins(currentPage);
      }
    } catch (error) {
      toast.error("Failed to delete bin");
    }
  };

  // -----------------------
  // 4️⃣ Table columns
  // -----------------------
  const Columns = [
    { label: "Bin ID", key: "binid" },
    { label: "Zone", key: "zone" },
    { label: "Ward", key: "ward" },
    { label: "Bin Type", key: "bintype" },
    { label: "Location", key: "location" },
    { label: "Filled%", key: "filled" },
    { label: "Last Updated", key: "lastReportedAt" }, // use frontend IST converted field
    { label: "Status", key: "status" },
  ];

  return (
    <div>
      <Table
        title="Bins"
        sub_title="Table"
        pagetitle="Bins"
        addButtonLabel="Add New Bin"
        addButtonIcon={<HiOutlineTrash size={22} />}
        colomns={Columns}
        tabledata={binData}
        onDelete={handleDeleteBin}
        AddModal={(modalProps) => (
          <AddNewBin
            {...modalProps}
            onclose={() => {
              modalProps.onclose();
              fetchbins(); // refresh table immediately after adding
            }}
          />
        )}
        ViewModel={true}
        EditModal={EditBins}
        loading={loading}
        routepoint={"viewbins"}
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
