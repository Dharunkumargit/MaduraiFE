import React from 'react'
import Table from '../../../components/Table'
import { RiUserAddLine } from 'react-icons/ri'
import { Userdata } from '../../../components/Data';
import AddUser from './AddUser';
import { useState, useEffect } from "react";

import axios from "axios";
import { API } from '../../../../const';
import EditUser from './EditUser';
import { toast } from 'react-toastify';
import AddEmploye from '../../employeemanagement/AddEmploye';
import Pagination from '../../../components/Pagination';

const User = () => {
  const [users, setusers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalItems, setTotalItems] = useState(0);

  const itemsPerPage = 8;

  const getAllUsers = async (page = 1) => {
    try {
      setLoading(true);
      const res = await axios.get(
        `${API}/user/getuser?page=${page}&limit=${itemsPerPage}`
      );

      setusers(res.data.data);
      setTotalItems(res.data.pagination.totalItems);
    } catch (error) {
      console.log("GET Users Error: ", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getAllUsers(currentPage);
  }, [currentPage]);

  const handleDeleteUser = async (id) => {
  if (!window.confirm("Are you sure you want to delete this user?")) return;

  try {
    await axios.delete(`${API}/user/deleteuserbyid/${id}`);
    toast.success("User deleted successfully");

    if (users.length === 1 && currentPage > 1) {
      setCurrentPage(prev => prev - 1);
    } else {
      getAllUsers(currentPage);
    }
  } catch (error) {
    toast.error("Failed to delete user");
  }
};

  const Columns = [
    { label: "Name", key: "name" },
    { label: "Role", key: "role" },
    { label: "Phone Number", key: "phonenumber" },
    
    { label: "Email", key: "email" },
    { label: "Status", key: "status" },
    { label: "Created By", key: "createdby" },
    
  ];
  return (
    <div>
      <Table title="Settings" sub_title="User" pagetitle="User"
      addButtonLabel="Add User"
      addButtonIcon={<RiUserAddLine size={22}/>}
      colomns={Columns}
      tabledata={users}
      loading={loading}
      showViewButton={false}
      onDelete={handleDeleteUser}
      AddModal={(modalProps) => <AddUser {...modalProps} onclose={() => {
        modalProps.onclose();
        getAllUsers(); // Refresh on close
      }} />}
      EditModal={true}
      
      
      editroutepoint={"edituser"}
      onEdit={(row) => {
         // ✅ DEBUG
        setSelectedUser(row);
      }}
      
      />
      <Pagination
        totalItems={totalItems}
        itemsPerPage={itemsPerPage}
        currentPage={currentPage}
        setCurrentPage={setCurrentPage}
      />
    </div>
  )
}

export default User
