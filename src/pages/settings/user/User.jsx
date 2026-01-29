import React from "react";
import Table from "../../../components/Table";
import { RiUserAddLine } from "react-icons/ri";
import { Userdata } from "../../../components/Data";
import AddUser from "./AddUser";
import { useState, useEffect } from "react";
import axios from "axios";
import { API } from "../../../../const";
import EditUser from "./EditUser";
import { toast } from "react-toastify";
import AddEmploye from "../../employeemanagement/AddEmploye";
import Pagination from "../../../components/Pagination";
import { useOutletContext } from "react-router";

const User = () => {
  const [employees, setEmployees] = useState([]); // ✅ Changed from users
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const { searchTerm } = useOutletContext();

  const filteredEmployees = employees.filter((employee) =>
    Object.values(employee).some((value) =>
      String(value).toLowerCase().includes(searchTerm.toLowerCase())
    )
  );
  const itemsPerPage = 8;

  // ✅ ONE LINE FILTER - Role assigned BUT no role_id
  const getEmployeesWithoutRoleId = async (page = 1) => {
    try {
      setLoading(true);
      const res = await axios.get(
        `${API}/employee/getemployees?page=${page}&limit=${itemsPerPage}`,
      );

      // ✅ FIXED FILTER - Show employees NEEDING role assignment
      const filteredEmployees = res.data.data.filter(
        (emp) =>
          // Case 1: Has role_name but NO role_id (pending role_id assignment)
          emp.role_name && emp.role_id,
      );

      console.log(`📊 Showing ${filteredEmployees.length} pending employees`);
      setEmployees(filteredEmployees);
      setTotalItems(filteredEmployees.length);
    } catch (error) {
      toast.error("Failed to load");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getEmployeesWithoutRoleId(currentPage);
  }, [currentPage]);

  const handleDeleteEmployee = async (id) => {
    if (!window.confirm("Delete this employee?")) return;
    try {
      await axios.delete(`${API}/employee/deleteemployee/${id}`);
      toast.success("Employee deleted");
      getEmployeesWithoutRoleId(currentPage); // Refresh
    } catch (error) {
      toast.error("Delete failed");
    }
  };

  const Columns = [
    { label: "Name", key: "name" },
    { label: "Role", key: "role_name" },
    { label: "Phone", key: "phonenumber" },
    { label: "Email", key: "emailid" },
    { label: "Status", key: "status" },
  ];

  return (
    <div>
      <Table
        title="Settings"
        sub_title="Users"
        pagetitle="User Role Assignment"
        addButtonLabel="Add User"
        addButtonIcon={<RiUserAddLine size={22} />}
        colomns={Columns}
        tabledata={filteredEmployees}
        loading={loading}
        onDelete={handleDeleteEmployee}
        AddModal={(props) => (
          <AddUser
            {...props}
            onclose={() => {
              props.onclose();
              getEmployeesWithoutRoleId();
            }}
          />
        )}
        EditModal={true}
        editroutepoint="edituser"
        showViewButton={false}
      />
    </div>
  );
};

export default User;
