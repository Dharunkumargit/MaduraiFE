import React, { useEffect, useState } from 'react';
import Table from '../../components/Table';
import axios from "axios";
import { API } from '../../../const';

const Escalation = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  const stored = localStorage.getItem("user");
  const user = JSON.parse(stored);
  const rolename = user?.role?.role_name || "Guest";

  const roleLevels = {
    'ACHO': ['L1', 'L2', 'L3', 'L4'],
    'CHO': ['L2', 'L3', 'L4'],
    'Deputy Commissioner': ['L3', 'L4'],
    'Commissioner': ['L4'],
    'Admin': ['L1', 'L2', 'L3', 'L4']
  };

const getEscalations = async () => {
    try {
      const res = await axios.get(`${API}/escalation/role/${rolename}`);
      
      // Accessing the nested path from your console log: res.data.data.bins
      const binsFromApi = res.data?.data?.bins || [];

      if (binsFromApi.length > 0) {
        const transformedBins = binsFromApi.map((bin) => {
          // 1. Get minutes from your specific key 'minutesAt100'
          const mins = parseInt(bin.minutesAt100 || 0);

          // 2. Filter the 'escalations' array provided in your JSON
          // We only show levels that exist in the roleLevels[rolename] array
          const visibleEsc = bin.escalations
            ? bin.escalations
                .filter((e) => roleLevels[rolename]?.includes(e.level))
                .map((e) => e.level)
                .join(", ")
            : "None";

          return {
            ...bin,
            displayMins: `${mins} mins`,
            currentLevel: bin.currentLevel || "100%", // Logic for the 'Status' column
            visibleEscalations: visibleEsc || "Pending", // Logic for 'Escalated Levels' column
            // Ensure location is handled if it's a string from your API
            location: bin.location || "N/A"
          };
        });

        setData(transformedBins);
      } else {
        setData([]);
      }
    } catch (err) {
      console.error("❌ Escalation UI Error:", err);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    getEscalations();
    // Refresh every 1 minute to update ETAs
    const interval = setInterval(getEscalations, 60000);
    return () => clearInterval(interval);
  }, [rolename]);

  const Columns = [
    { label: "Bin ID", key: "binid" },
    { label: "Zone", key: "zone" },
    { label: "Ward", key: "ward" },
    { label: "Street/Location", key: "location" }, // Changed to street as per backend fix
    { label: "Duration Full", key: "displayMins" }, // Fixed key formatting
    { label: "Current Level", key: "currentLevel" },

    { label: "Escalated Levels", key: "visibleEscalations" },
  ];

  return (
    <div className="">
      <Table
          itemsPerPage={9}
        currentPage={1}
        title={`Escalation Control Tower - ${rolename}`}
        sub_title={`${data.length} critical `}
        pagetitle="Escalation"
        colomns={Columns}
        tabledata={data}
        showEditButton={false}
        showDeleteButton={false}
        ViewModel={true}
        routepoint={"viewescalation"}
        loading={loading}
      />
    </div>
  );
};

export default Escalation;