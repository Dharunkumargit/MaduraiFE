import React, { useState, useEffect } from "react";
import Title from "../../components/Title";
import SummaryCard from "../../components/SummaryCard";
import { HiOutlineTrash } from "react-icons/hi";
import DonutChart from "../../components/DonutChart";

import {
  Barcolors,
  Bardata,
  Piechartprojectdata,
  Projectcolor,
} from "../../components/Data";
import ChartTitle from "../../components/ChartTitle";
import { TbReportAnalytics, TbTrashX } from "react-icons/tb";
import axios from "axios";
import { API } from "../../../const";
import { IoTrashBinOutline } from "react-icons/io5";

const Dashboard = () => {
  const [binsData, setBinsData] = useState([]);
  const [wardsdata, setWardsData] = useState([]);
  const [hotspotdata, setHotspotData] = useState([]);
  const [escalationdata, setEscalationData] = useState([]);
  const [Piechartdata, setPieChartData] = useState([]);
  const [Barchartdata, setBarChartData] = useState([]);
  const [stats, setStats] = useState({});
  const [loading, setLoading] = useState(true);

  // 🔥 LIVE DATA FETCH
  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);

        const response = await axios.get(`${API}/dashboard/all`);
        const result = response.data; // ← THIS WAS THE BUG

        if (result.success) {
          const data = result.data;

          // 🔥 SUMMARY CARDS - WORKING ✅
          setStats(data.stats || {});

          // 🔥 ZONES TABLE - Fix mapping (missing zones data)
          setBinsData(
            data.topZones?.map((z, i) => ({
              id: i + 1,
              zone: z._id || "Unknown",
              bin: z.binCount || 0,
              waste: `${z.totalClearedTons || 0} Ton`,
            })) || [],
          );

          // 🔥 WARDS TABLE - Fix mapping
          setWardsData(
            data.topWards?.map((w, i) => ({
              ward: w._id || "Unknown",
              bin: (w.binCount || 0).toString(),
              waste: `${w.totalClearedTons || 0} Ton`,
            })) || [],
          );

          setPieChartData(
            data.monthlyZones
              ?.sort((a, b) => b.totalClearedTons - a.totalClearedTons)
              ?.slice(0, 3)
              .map((z, i) => ({
                name: `Zone ${i + 1}`,
                value: z.totalClearedTons || 1,
              })) || Piechartprojectdata,
          );

          setBarChartData(
            data.todayZones
              ?.sort((a, b) => b.totalClearedTons - a.totalClearedTons)
              ?.slice(0, 5)
              .map((z, i) => ({
                name: `Zone ${i + 1}`,
                value: z.totalClearedTons || 1,
              })) || Bardata,
          );

          // 🔥 HOTSPOTS - Use topLocations
          setHotspotData(
            data.topLocations?.map((loc, i) => ({
              location: loc.location || "Unknown",
              waste: `${loc.totalClearedTons || 0} Ton`, // Convert liters to tons
            })) || [],
          );

          // 🔥 ESCALATIONS
          setEscalationData(
            data.escalations?.map((e, i) => ({
              engineer: e._id || e.engineer || "Unknown",
              escalation: (e.escalationCount || 0).toString(),
            })) || [],
          );
        }
      } catch (error) {
        console.error("Dashboard error:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
    // 🔥 AUTO REFRESH EVERY 30s
    const interval = setInterval(fetchDashboardData, 30000);
    return () => clearInterval(interval);
  }, []);

  if (loading) {
    return (
      <div className="h-full mb-30 mr-3 flex items-center justify-center">
        <div className="text-lg">Loading Live Data...</div>
      </div>
    );
  }

  return (
    <div className="h-full mb-30 mr-3">
      <Title
        title="Dashboard"
        sub_title="Main Dashboard"
        page_title="Main Dashboard"
      />

      <div className="mt-4 space-y-3 overflow-y-auto h-full no-scrollbar">
        {/* 🔥 SUMMARY CARDS - LIVE DATA */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-3">
          <SummaryCard
            status="Waste collected"
            value={`${stats.waste?.totalWasteCollected || 0} Tons`}
            title="Total Waste Collected"
            icon={<IoTrashBinOutline  size={20} />}
          />
          <SummaryCard
            status="Waste Collected"
            value={`${stats.waste?.currentMonthWaste || 0} Tons`}
            title="Month Wise Waste Collected"
            icon={<IoTrashBinOutline  size={20} />}
          />
          <SummaryCard
            status="Waste Collected"
            value={`${stats.waste?.monthlyAvgWaste || 0} Tons`}
            title="Average Montly Waste Collected"
            icon={<IoTrashBinOutline  size={20} />}
          />
          <SummaryCard
            status="Active Bins"
            value={stats.bins?.activeBins || 0}
            title="Active Bins"
            icon={<IoTrashBinOutline  size={21} />}
          />
          <SummaryCard
            status="InActive Bins"
            value={stats.bins?.inactiveBins || 0}
            title="InActive Bins"
            icon={<IoTrashBinOutline  size={21} />}
          />

          <SummaryCard
            title="Total Bins"
            value={stats.bins?.totalBins || 0}
            status="All Bins"
            icon={<IoTrashBinOutline  size={21} />}
          />
        </div>

        {/* 🔥 CHARTS - SAME UI */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-3">
          <DonutChart
            title="HotSpot-Zone Wise"
            data={Piechartdata}
            colors={Projectcolor}
          />

          <ChartTitle
            title="Daily Waste Collection"
            data={Barchartdata}
            colors={Barcolors}
          />

          {/* 🔥 ZONE TABLE - LIVE DATA */}
          <div className="bg-lightest-blue rounded-xl border-3 border-white font-roboto-flex">
            <div className="mb-6 pt-6 px-5">
              <h2 className="text-base font-semibold text-black">
                Zone Wise Bins
              </h2>
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full bg-white rounded-lg shadow-lg overflow-hidden mt-2">
                <thead>
                  <tr className="bg-white text-center text-black font-semibold border-b-3 border-light-blue ">
                    <th className="py-4 px-4 text-sm">S.No</th>
                    <th className="py-4 px-4 text-sm">Zone</th>
                    <th className="py-4 px-4 text-sm">Bins</th>
                    <th className="py-4 px-4 text-sm">Waste Collected</th>
                  </tr>
                </thead>
                <tbody>
                  {binsData.map((bin, index) => (
                    <tr
                      key={bin.id}
                      className="text-gray-600 border-b-2 border-light-blue last:border-none text-center text-sm"
                    >
                      <td className="py-3 px-4 text-sm">{index + 1}</td>
                      <td className="py-3 px-4 text-sm">{bin.zone}</td>
                      <td className="py-3 px-4 text-sm">{bin.bin}</td>
                      <td className="py-3 px-4 text-sm">{bin.waste}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* 🔥 TABLES - LIVE DATA (SAME UI) */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-3">
          <div className="bg-lightest-blue rounded-xl border-3 border-white h-74 font-roboto-flex">
            <h2 className="text-base font-semibold p-4 text-black">
              Top 10 Wards
            </h2>
            <div className="overflow-x-auto">
              <table className="min-w-full bg-white rounded-lg shadow-xl overflow-hidden">
                <thead>
                  <tr className="bg-white text-center text-black font-bold border-b-3 border-light-blue text-sm">
                    <th className="py-4 px-5 text-sm">S.no</th>
                    <th className="py-4 px-5 text-sm">Ward</th>
                    <th className="py-4 px-5 text-sm">Bins</th>
                    <th className="py-4 px-5 text-sm">Waste collected</th>
                  </tr>
                </thead>
                <tbody>
                  {wardsdata.map((bin, index) => (
                    <tr
                      key={index}
                      className="text-light-grey border-b-2 border-light-blue last:border-none text-center text-sm"
                    >
                      <td className="py-3 px-5 text-sm">{index + 1}</td>
                      <td className="py-3 px-5 text-sm">{bin.ward}</td>
                      <td className="py-3 px-5 text-sm">{bin.bin}</td>
                      <td className="py-3 px-5 text-sm">{bin.waste}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="bg-lightest-blue rounded-xl border-3 border-white h-74 font-roboto-flex">
            <h2 className="text-base font-semibold p-4 text-black">
              Top 10 Hotspot
            </h2>
            <div className="overflow-x-auto">
              <table className="min-w-full bg-white rounded-lg overflow-hidden">
                <thead>
                  <tr className="bg-white text-center text-black font-semibold border-b-3 border-light-blue text-sm">
                    <th className="py-4 px-5 text-sm">S.no</th>
                    <th className="py-4 px-5 text-sm">Location</th>
                    <th className="py-4 px-5 text-sm">Waste collected</th>
                  </tr>
                </thead>
                <tbody>
                  {hotspotdata.map((bin, index) => (
                    <tr
                      key={index}
                      className="text-light-grey border-b-2 border-light-blue last:border-none text-center text-sm"
                    >
                      <td className="py-3 px-5 text-sm">{index + 1}</td>
                      <td className="py-3 px-5 text-sm">{bin.location}</td>
                      <td className="py-3 px-5 text-sm">{bin.waste}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="bg-lightest-blue rounded-xl border-3 border-white h-74">
            <h2 className="text-base font-semibold p-4 text-black">
              Top 10 Escalation
            </h2>
            <div className="overflow-x-auto">
              <table className="min-w-full bg-white rounded-lg overflow-hidden">
                <thead>
                  <tr className="bg-white text-center text-black font-semibold border-b-3 border-light-blue text-sm">
                    <th className="py-4 px-5">S.no</th>
                    <th className="py-4 px-5 text-sm">Engineer</th>
                    <th className="py-4 px-5 text-sm">Escalation</th>
                  </tr>
                </thead>
                <tbody>
                  {escalationdata.map((bin, index) => (
                    <tr
                      key={index}
                      className="text-light-grey border-b-2 border-light-blue last:border-none text-center text-sm"
                    >
                      <td className="py-3 px-5 text-sm">{index + 1}</td>
                      <td className="py-3 px-5 text-sm">{bin.engineer}</td>
                      <td className="py-3 px-5 text-sm">{bin.escalation}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;