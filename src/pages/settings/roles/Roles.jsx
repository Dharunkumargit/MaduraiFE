import React, { useEffect, useState } from "react";
import Table from "../../../components/Table";
import Pagination from "../../../components/Pagination";
import { GrGroup } from "react-icons/gr";
import axios from "axios";
import AddRoles from "./AddRoles";
import { toast } from "react-toastify";
import { API } from "../../../../const";
import { useOutletContext } from "react-router";

const Roles = () => {
  const [roleData, setRoleData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const { searchTerm } = useOutletContext();
  const filteredRoles = roleData.filter((role) =>
    Object.values(role).some((value) =>
      String(value).toLowerCase().includes(searchTerm.toLowerCase())
    )
  );

  const itemsPerPage = 8;

  const getRoles = async (page = 1) => {
    try {
      setLoading(true);
      const res = await axios.get(
        `${API}/roles/getroles?page=${page}&limit=${itemsPerPage}`
      );

      setRoleData(res.data.data);
      setTotalItems(res.data.pagination.totalItems);
    } catch (error) {
      toast.error("Failed to fetch roles");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getRoles(currentPage);
  }, [currentPage]);

  const handleDeleteRole = async (id) => {
    if (!window.confirm("Are you sure you want to delete this role?")) return;

    try {
      await axios.delete(`${API}/roles/deleterolebyid/${id}`);
      toast.success("Role deleted successfully");

      // Reload current page
      getRoles(currentPage);
    } catch (error) {
      toast.error("Failed to delete role");
    }
  };

  const Columns = [
    { label: "Role Name", key: "role_name" },
    { label: "Created By", key: "created_by_user" },
  ];

  return (
    <div>
      <Table
        title="Settings"
        sub_title="Roles"
        pagetitle="Roles"
        addButtonLabel="Add Role"
        addButtonIcon={<GrGroup size={22} />}
        colomns={Columns}
        tabledata={filteredRoles}
        onDelete={handleDeleteRole}
        loading={loading}
        showViewButton={false}
        addroutepoint="addroles"
        EditModal={true}
        editroutepoint="editroles"
        AddModal={(props) => (
          <AddRoles
            {...props}
            onclose={() => {
              props.onclose();
              getRoles(currentPage);
            }}
          />
        )}
      />

      {/* ✅ PAGINATION */}
      <Pagination
        currentPage={currentPage}
        totalItems={totalItems}
        itemsPerPage={itemsPerPage}
        onPageChange={setCurrentPage}
      />
    </div>
  );
};

export default Roles;
