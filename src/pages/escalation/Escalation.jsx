import React, { useEffect, useState } from "react";
import Table from "../../components/Table";
import axios from "axios";
import { API } from "../../../const";

const Escalation = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  const user = JSON.parse(localStorage.getItem("user"));
  const rolename = user?.role?.role_name;

  const getEscalations = async () => {
    try {
      const res = await axios.get(`${API}/escalation/role/${rolename}`);

      // ✅ bins array only
      setData(res.data.data.bins);
    } catch (err) {
      console.error("❌ Escalation Error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getEscalations();
  }, []);

  const Columns = [
    { label: "Bin ID", key: "binid" },
    { label: "Zone", key: "zone" },
    { label: "Ward", key: "ward" },
    { label: "Location", key: "street" }, // 🔥 FIXED
    { label: "Fill Level (%)", key: "filled" },
    { label: "Status", key: "status" },
  ];

  if (loading) return <div>🔄 Loading Escalations...</div>;
  if (data.length === 0)
    return <div>📭 No escalations for {rolename}</div>;

  return (
    <Table
      title={`Escalation Dashboard - ${rolename}`}
      sub_title={`${data.length} bins`}
      pagetitle="Escalation"
      colomns={Columns}
      tabledata={data}
      showEditButton={false}
      showDeleteButton={false}
      ViewModel={true}
      routepoint={"viewescalation"}
    />
  );
};

export default Escalation;
