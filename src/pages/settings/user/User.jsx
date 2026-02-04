import React, { useEffect, useState } from "react";
import Table from "../../../components/Table";
import { RiUserAddLine } from "react-icons/ri";
import AddUser from "./AddUser";
import axios from "axios";
import { API } from "../../../../const";
import { toast } from "react-toastify";
import Pagination from "../../../components/Pagination";
import { useOutletContext } from "react-router";

const User = () => {
  const { searchTerm } = useOutletContext();

  const [employees, setEmployees] = useState([]);        // paginated data
  const [allEmployees, setAllEmployees] = useState([]);  // full data for search
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalItems, setTotalItems] = useState(0);

  const itemsPerPage = 8;

  // 🔹 EXISTING API CALL (UNCHANGED)
  const getEmployeesWithoutRoleId = async (page = 1) => {
    try {
      setLoading(true);

      const res = await axios.get(
        `${API}/employee/getemployees?page=${page}&limit=${itemsPerPage}`
      );

      // keep your existing logic exactly
      const filteredEmployees = res.data.data.filter(
        (emp) => emp.role_name && emp.role_id
      );

      setEmployees(filteredEmployees);
      setTotalItems(res.data.pagination.totalItems);
      setCurrentPage(res.data.pagination.currentPage);
    } catch (error) {
      toast.error("Failed to load");
    } finally {
      setLoading(false);
    }
  };

  // 🔹 FETCH ALL PAGES (ONLY FOR SEARCH)
  const fetchAllEmployees = async () => {
    try {
      setLoading(true);

      let page = 1;
      let allData = [];
      let totalPages = 1;

      do {
        const res = await axios.get(
          `${API}/employee/getemployees?page=${page}&limit=${itemsPerPage}`
        );

        const filtered = res.data.data.filter(
          (emp) => emp.role_name && emp.role_id
        );

        allData = [...allData, ...filtered];
        totalPages = res.data.pagination.totalPages;
        page++;
      } while (page <= totalPages);

      setAllEmployees(allData);
      setTotalItems(allData.length);
      setCurrentPage(1);
    } catch (error) {
      toast.error("Failed to load");
    } finally {
      setLoading(false);
    }
  };

  // 🔹 SEARCH + PAGINATION HANDLING
  useEffect(() => {
    if (searchTerm) {
      fetchAllEmployees();      // 🔥 search across ALL pages
    } else {
      getEmployeesWithoutRoleId(currentPage);
    }
  }, [searchTerm, currentPage]);

  // 🔹 CLIENT-SIDE SEARCH (NOW WORKS ACROSS ALL PAGES)
  const filteredEmployees = (searchTerm ? allEmployees : employees).filter(
    (employee) =>
      Object.values(employee).some((value) =>
        String(value).toLowerCase().includes(searchTerm.toLowerCase())
      )
  );

  // 🔹 DELETE (UNCHANGED)
  const handleDeleteEmployee = async (id) => {
    if (!window.confirm("Delete this employee?")) return;
    try {
      await axios.delete(`${API}/employee/deleteemployee/${id}`);
      toast.success("Employee deleted");
      searchTerm
        ? fetchAllEmployees()
        : getEmployeesWithoutRoleId(currentPage);
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
    <>
      <Table
        itemsPerPage={itemsPerPage}
        currentPage={currentPage}
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
              searchTerm
                ? fetchAllEmployees()
                : getEmployeesWithoutRoleId(currentPage);
            }}
          />
        )}
        EditModal={true}
        editroutepoint="edituser"
        showViewButton={false}
      />

      {!searchTerm && (
        <Pagination
          totalItems={totalItems}
          itemsPerPage={itemsPerPage}
          currentPage={currentPage}
          setCurrentPage={setCurrentPage}
        />
      )}
    </>
  );
};

export default User;
