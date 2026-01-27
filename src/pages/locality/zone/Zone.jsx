import React, { useEffect, useState } from "react";
import Table from "../../../components/Table";
import { Zonedata } from "../../../components/Data";
import axios from "axios";
import { LuMapPin } from "react-icons/lu";
import AddZone from "./AddZone";
import { API } from "../../../../const";
import { Edit } from "lucide-react";
import EditZone from "./EditZone";
import { toast } from "react-toastify";
import Pagination from "../../../components/Pagination";

const Zone = () => {
  const [zones, setZones] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const [loading, setLoading] = useState(false);
  const itemsPerPage = 8;
  const getZones = async (page = 1) => {
    try {
      setLoading(true);
      const res = await axios.get(
        `${API}/zone/getzones?page=${page}&limit=${itemsPerPage}`,
      );

      setZones(res.data.data);
      setTotalItems(res.data.totalItems);
      setCurrentPage(res.data.currentPage);
    } catch (error) {
      console.log("Zone Fetch Error:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getZones(currentPage);
  }, [currentPage]);

  const Columns = [
    { label: "Zone Name", key: "zonename" },
    { label: "Total Bins", key: "totalbins" },
    { label: "Active Bins", key: "activebins" },

    { label: "Inactive Bins", key: "inactivebins" },
    { label: "Status", key: "status" },
  ];
  const handleZonedelete = async (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this zone?",
    );

    if (!confirmDelete) return;

    try {
      await axios.delete(`${API}/zone/deletezonebyid/${id}`);
      toast.success("Zone deleted successfully");

      
      setZones((prev) => prev.filter((zone) => zone._id !== id));
    } catch (error) {
      toast.error("Failed to delete zone");
    }
  };
  return (
    <div>
      <Table
        title="Locality"
        sub_title="Zone"
        pagetitle="Zone"
        colomns={Columns}
        tabledata={zones}
        showViewButton={false}
        addButtonLabel="Add Zone"
        EditModal={EditZone}
        loading={loading}
        onDelete={handleZonedelete}
        addButtonIcon={<LuMapPin size={22} />}
        AddModal={(props) => <AddZone {...props} onRefresh={getZones} />}
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

export default Zone;
