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
  const [employees, setEmployees] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const [loading, setLoading] = useState(false);
  const { searchTerm } = useOutletContext();
  const filteredEmployees = employees.filter((employee) =>
    Object.values(employee).some((value) =>
      String(value).toLowerCase().includes(searchTerm.toLowerCase())
    )
  );

  const itemsPerPage = 9;

  const Columns = [
    { label: "Name", key: "name" },
    { label: "Phone Number", key: "phonenumber" },
    { label: "Email ID", key: "emailid" },
    { label: "Location", key: "location" },
    { label: "Designation", key: "designation" },
    { label: "Status", key: "status" },
  ];

  // ✅ FETCH EMPLOYEES
  const getEmployees = async (page = 1) => {
    try {
      setLoading(true);

      const res = await axios.get(
        `${API}/employee/getemployees?page=${page}&limit=${itemsPerPage}`
      );

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

      // 🧠 If last item on page → go back
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
    <div>
      <Table
        itemsPerPage={itemsPerPage}
        currentPage={currentPage}
        title="Employee Management"
        sub_title="Table"
        pagetitle="Employee Management"
        colomns={Columns}
        tabledata={filteredEmployees}
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
  );
};

export default EmployeeManagement;
