import React, { useEffect, useState } from 'react';
import Table from '../../components/Table';
import axios from "axios";
import { API } from '../../../const';

const Escalation = () => {
  const [data, setData] = useState([]);  // ✅ Empty array initially
  const [loading, setLoading] = useState(true);
  
  const stored = localStorage.getItem("user");
  const user = JSON.parse(stored);
  const rolename = user.role;

  const getEscalations = async () => {
    try {
      
      const res = await axios.get(`${API}/escalation/role/${rolename}`);
      

      
      // 🔥 FIX 1: Set ONLY bins array (length 1)
      setData(res.data.data.bins);
    } catch (err) {
      console.error("❌ Escalation Error:", err.response?.data || err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getEscalations();
  }, []);

  // 🔥 FIX 2: Match EXACT column keys to your data
  const Columns = [
    { label: "Bin ID", key: "binid" },
    { label: "Ward", key: "ward" },
    { label: "Zone", key: "zone" },
    { label: "Status", key: "status" },
    { label: "Priority", key: "priority" },
    { label: "Fill Level", key: "filled" },  // Add this if API sends filled
    // Remove engineer/escalationlevel - they don't exist in bin data
  ];


  if (loading) return <div>🔄 Loading Escalations...</div>;
  if (data.length === 0) return <div>📭 No escalations for {rolename}</div>;

  return (
    <div>
      <Table 
        title={`Escalation Dashboard - ${rolename}`} 
        sub_title={`${data.length} bins`} 
        pagetitle="Escalation"
        colomns={Columns} 
        tabledata={data}  // ✅ Now length = 1
        showEditButton={false}
        showDeleteButton={false}
        ViewModel={true}
        routepoint={"viewescalation"}
      />
    </div>
  );
};

export default Escalation;