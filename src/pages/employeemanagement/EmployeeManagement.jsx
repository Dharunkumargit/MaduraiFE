import React, { useEffect, useState } from 'react'
import Table from '../../components/Table'
import { Employeemanagementdata } from '../../components/Data';
import AddEmploye from './AddEmploye';

import { LuContact } from 'react-icons/lu';
import { API } from '../../../const';
import axios from 'axios';
import { toast } from 'react-toastify';
import EditEmployee from './EditEmployee';
import Pagination from '../../components/Pagination';
import { set } from 'mongoose';

const EmployeeManagement = () => {
  const [employees, setEmployees] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const [loading, setLoading] = useState(false);

  const itemsPerPage = 9;
  const Columns = [
    { label: "Name", key: "name" },
    
    { label: "Phone Number", key: "phonenumber" },
    { label: "Email ID", key: "emailid" },
    { label: "Location", key: "location" },
    { label: "Designation", key: "designation" },
    { label: "Status", key: "status" },
    
  ];
  const getEmployees = async (page = 1) => {
  try {
    setLoading(true);

    const res = await axios.get(
      `${API}/employee/getemployees?page=${page}&limit=${itemsPerPage}`
    );

    setEmployees(res.data.data);
    setTotalItems(res.data.pagination.totalItems);
    setCurrentPage(res.data.pagination.currentPage);
  } catch (err) {
    console.log("Error fetching employees:", err);
  } finally {
    setLoading(false);
  }
};

useEffect(() => {
  getEmployees(currentPage);
}, [currentPage]);
 
  const handleDelete = async (id) => {
  if (!window.confirm("Are you sure you want to delete?")) return;

  try {
    await axios.delete(`${API}/employee/deleteemployee/${id}`);
    toast.success("Employee deleted successfully");

    // 🧠 If last item on page → go back one page
    if (employees.length === 1 && currentPage > 1) {
      setCurrentPage(prev => prev - 1);
    } else {
      getEmployees(currentPage);
    }
  } catch (error) {
    toast.error(error.response?.data?.message || "Delete failed");
  }
};

  

  return (
    <div>
      <Table title="Employee Management" sub_title="Table" pagetitle="Employee Management"
      colomns={Columns}
      tabledata={employees}
      addButtonLabel="Add Employee"
      addButtonIcon={<LuContact size={22}/>}
      AddModal={(modalProps) => <AddEmploye {...modalProps} onclose={() => {
        modalProps.onclose();
        getEmployees(); 
      }} />}
      
      showViewButton={false}
      loading={loading}
      showDeleteButton={true}
      onDelete={handleDelete}
      EditModal={EditEmployee}
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

export default EmployeeManagement
