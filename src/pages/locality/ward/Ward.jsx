import React, { useEffect, useState } from 'react'
import Table from '../../../components/Table'
import { Warddata } from '../../../components/Data';
import axios from "axios";
import { RiUserAddLine } from 'react-icons/ri';
import AddWard from './AddWard';
import { API } from '../../../../const';
import EditWard from './EditWard';
import { toast } from 'react-toastify';
import { get } from 'mongoose';
import Pagination from '../../../components/Pagination';
import { useOutletContext } from 'react-router';

const Ward = () => {
  const [wards, setWards] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const [loading, setLoading] = useState(false);
  const { searchTerm } = useOutletContext();
  const filteredWards = wards.filter((ward) =>
    Object.values(ward).some((value) =>
      String(value).toLowerCase().includes(searchTerm.toLowerCase())
    )
  );

  const itemsPerPage = 9;

  const getWards = async (page = 1) => {
    try {
      setLoading(true);
      const res = await axios.get(
        `${API}/ward/getwards?page=${page}&limit=${itemsPerPage}`
      );

      setWards(res.data.data);
      setTotalItems(res.data.pagination.totalItems);
    } catch (error) {
      console.log("Ward Fetch Error:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getWards(currentPage);
  }, [currentPage]);

    const Columns = [
        { label: "Zone", key: "zonename" },
        { label: "Ward", key: "wardname" },
        { label: "Total Location", key: "totalbins" },
        { label: "Active Location", key: "activebins" },
        { label: "Inactive Location", key: "inactivebins" },
        { label: "Status", key: "status" },
      ];

      const handleWarddelete = async (id) => {
        const confirmDelete = window.confirm(
          "Are you sure you want to delete this ward?"
        );
        if (!confirmDelete) return;
        try {
          await axios.delete(`${API}/ward/deleteward/${id}`);
          toast.success("Ward deleted successfully");
          getWards(currentPage);
          setWards((prev) => prev.filter((ward) => ward._id !== id));
        } catch (error) {
          toast.error("Failed to delete ward");
        }
      }
  return (
    <div>
        <Table 
        itemsPerPage={itemsPerPage}
        currentPage={currentPage}
        title="Master" sub_title="Ward" 
        pagetitle="Ward"
        colomns={Columns}
        EditModal={EditWard}
        showViewButton={false}
        tabledata={filteredWards} 
        loading={loading}
        onDelete={handleWarddelete}
        addButtonLabel="Add Ward"
        addButtonIcon={<RiUserAddLine size={22} />}
        AddModal={(props) => <AddWard {...props} onRefresh={getWards} />}/>
        <Pagination
        totalItems={totalItems}
        itemsPerPage={itemsPerPage}
        currentPage={currentPage}
        setCurrentPage={setCurrentPage}
      />
    </div>
  )
}

export default Ward