import React, { useEffect, useState } from "react";
import Table from "../../components/Table";
import Pagination from "../../components/Pagination";
import AddEmploye from "./AddEmploye";
import EditEmployee from "./EditEmployee";
import { LuContact } from "react-icons/lu";
import axios from "axios";
import { API } from "../../../const";
import { toast } from "react-toastify";
import { useOutletContext } from "react-router";

const EmployeeManagement = () => {
  const { searchTerm } = useOutletContext();

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

  // ✅ FETCH EMPLOYEES (SERVER SEARCH + PAGINATION)
  const getEmployees = async (page = 1) => {
    try {
      setLoading(true);

      const res = await axios.get(`${API}/employee/getemployees`, {
        params: {
          page,
          limit: itemsPerPage,
          search: searchTerm, // ✅ IMPORTANT
        },
      });

      setEmployees(res.data.data);
      setTotalItems(res.data.pagination.totalItems);
      setCurrentPage(res.data.pagination.currentPage);
    } catch (error) {
      console.error(error);
      toast.error("Failed to load employees");
    } finally {
      setLoading(false);
    }
  };

  // 🔹 SEARCH OR PAGE CHANGE
  useEffect(() => {
    setCurrentPage(1);
    getEmployees(1);
  }, [searchTerm]);

  useEffect(() => {
    getEmployees(currentPage);
  }, [currentPage]);

  // ✅ DELETE EMPLOYEE
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete?")) return;

    try {
      await axios.delete(`${API}/employee/deleteemployee/${id}`, {
        headers: {
          "x-session-id": sessionStorage.getItem("sessionId"),
        },
      });

      toast.success("Employee deleted successfully");

      if (employees.length === 1 && currentPage > 1) {
        setCurrentPage((prev) => prev - 1);
      } else {
        getEmployees(currentPage);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Delete failed");
    }
  };

  return (
    <>
      <Table
        title="Employee Management"
        sub_title="Table"
        pagetitle="Employee Management"
        itemsPerPage={itemsPerPage}
        currentPage={currentPage}
        colomns={Columns}
        tabledata={employees} 
        loading={loading}
        addButtonLabel="Add Employee"
        addButtonIcon={<LuContact size={22} />}
        AddModal={(modalProps) => (
          <AddEmploye
            {...modalProps}
            onclose={() => {
              modalProps.onclose();
              getEmployees(currentPage);
            }}
          />
        )}
        showViewButton={false}
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
    </>
  );
};

export default EmployeeManagement;
