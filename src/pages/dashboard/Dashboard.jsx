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
import { useNavigate } from "react-router";

const Dashboard = () => {
  const [binsData, setBinsData] = useState([]);
  const [wardsdata, setWardsData] = useState([]);
  const [hotspotdata, setHotspotData] = useState([]);
  const [escalationdata, setEscalationData] = useState([]);
  const [Piechartdata, setPieChartData] = useState([]);
  const [Barchartdata, setBarChartData] = useState([]);
  const [stats, setStats] = useState({});
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate(); // 🔥 NAVIGATION HOOK

  // 🔥 FILTER NAVIGATION FUNCTION
  const handleFilterClick = (percentageRange) => {
    navigate(`/location?filter=${percentageRange}`);
  };

  // 🔥 LIVE DATA FETCH - 30s AUTO REFRESH
  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`${API}/dashboard/all`);
        console.log(response);
        
        const result = response.data;

        if (result.success) {
          const data = result.data;

          // 🔥 6 SUMMARY CARDS - FILL LEVELS + BINS (NOW CLICKABLE)
          setStats(data.stats || {});

          // 🔥 ZONES - 100% BINS ONLY
          setBinsData(
            data.topZones?.map((z, i) => ({
              id: i + 1,
              zone: z._id || "Unknown",
              fullBins: z.fullBinsCount || 0,
            })) || []
          );

          // 🔥 WARDS - 100% BINS ONLY (SAME FORMAT)
          setWardsData(
            data.topWards?.map((w, i) => ({
              ward: w._id || "Unknown",
              fullBins: w.fullBinsCount || 0,
            })) || []
          );

          // 🔥 CHARTS
          setPieChartData(
            data.monthlyZones
              ?.sort((a, b) => b.totalClearedTons - a.totalClearedTons)
              ?.slice(0, 3)
              .map((z, i) => ({
                name: z._id || `Zone ${i + 1}`,
                value: z.totalClearedTons || 1,
              })) || Piechartprojectdata
          );

          setBarChartData(
            data.todayZones
              ?.sort((a, b) => b.totalClearedTons - a.totalClearedTons)
              ?.slice(0, 5)
              .map((z, i) => ({
                name: z._id || `Zone ${i + 1}`,
                value: z.totalClearedTons || 1,
              })) || Bardata
          );

          // 🔥 HOTSPOTS
          setHotspotData(
            data.topLocations?.map((loc, i) => ({
              location: loc.location || "Unknown",
              waste: `${loc.totalClearedTons || 0} Ton`,
            })) || []
          );

          // 🔥 L1-L4 ESCALATIONS
          setEscalationData(
            data.escalations?.map((e, i) => ({
              level: e.level ? `L${e.level}` : `L${i + 1}`,
              count: e.count || 0,
            })) || []
          );
        }
      } catch (error) {
        console.error("Dashboard error:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
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
        sub_title="Live Bin Monitoring"
        page_title="Main Dashboard"
      />

      <div className="mt-4 space-y-3 overflow-y-auto h-full no-scrollbar">
        {/* 🔥 6-CARD STRUCTURE - NOW CLICKABLE WITH FILTER */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-3">
          <SummaryCard
            status="0-50% Bins"
            value={stats.fillLevels?.zeroToFifty || 0}
            title="Low Fill Bins"
            icon={<TbTrashX size={20} />}
            onClick={() => handleFilterClick("0-50")} // 🔥 FILTER 0-50%
            clickable={true} // 🔥 Make clickable
          />
          <SummaryCard
            status="51-75% Bins"
            value={stats.fillLevels?.fiftyOneToSeventyFive || 0}
            title="Medium Fill Bins"
            icon={<TbTrashX size={20} />}
            onClick={() => handleFilterClick("51-75")} // 🔥 FILTER 51-75%
            clickable={true}
          />
          <SummaryCard
            status="76-99% Bins"
            value={stats.fillLevels?.seventySixToNinetyNine || 0}
            title="High Fill Bins"
            icon={<TbTrashX size={20} />}
            onClick={() => handleFilterClick("76-99")} // 🔥 FILTER 76-99%
            clickable={true}
          />
          <SummaryCard
            status="100% Bins"
            value={stats.fillLevels?.hundred || 0}
            title="Critical Bins"
            icon={<TbReportAnalytics size={21} />}
            onClick={() => handleFilterClick("100")} // 🔥 FILTER 100%
            clickable={true}
          />
          <SummaryCard
            status="InActive Bins"
            value={stats.bins?.inactiveBins || 0}
            title="InActive Bins"
            icon={<TbTrashX size={21} />}
            onClick={() => handleFilterClick("inactive")} // 🔥 FILTER INACTIVE
            clickable={true}
          />
          <SummaryCard
            title="Total Bins"
            value={stats.bins?.totalBins || 0}
            status="All Bins"
            icon={<TbReportAnalytics size={21} />}
            onClick={() => handleFilterClick("all")} // 🔥 SHOW ALL BINS
            clickable={true}
          />
        </div>

        {/* 🔥 REST OF YOUR DASHBOARD REMAINS SAME */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-3">
          <DonutChart title="Monthly Zone Wise" data={Piechartdata} colors={Projectcolor} />
          <ChartTitle title="Today Waste Collection" data={Barchartdata} colors={Barcolors} />

          {/* 🔥 ZONE TABLE - 100% BINS ONLY (3 COLS) */}
          <div className="bg-lightest-blue rounded-xl border-3 border-white font-roboto-flex">
            <div className="mb-6 pt-6 px-5">
              <h2 className="text-base font-semibold text-black">Zone Wise 100% Bins</h2>
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full bg-white rounded-lg shadow-lg overflow-hidden mt-2">
                <thead>
                  <tr className="bg-white text-center text-black font-semibold border-b-3 border-light-blue">
                    <th className="py-4 px-4 text-sm">S.No</th>
                    <th className="py-4 px-4 text-sm">Zone</th>
                    <th className="py-4 px-4 text-sm">100% Bins</th>
                  </tr>
                </thead>
                <tbody>
                  {binsData.map((bin, index) => (
                    <tr key={bin.id} className="text-gray-600 border-b-2 border-light-blue last:border-none text-center text-sm">
                      <td className="py-3 px-4 text-sm">{index + 1}</td>
                      <td className="py-3 px-4 text-sm">{bin.zone}</td>
                      <td className="py-3 px-4 text-sm font-bold text-red-600">{bin.fullBins}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* 🔥 TABLES - 100% BINS FOR WARDS TOO */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-3">
  {/* 🔥 WARDS */}
  <div className="bg-lightest-blue rounded-xl border-3 border-white font-roboto-flex">
    <h2 className="text-base font-semibold p-4 text-black">
      Top Wards 100% Bins
    </h2>

    <div className="max-h-72 overflow-y-auto">
      <table className="w-full table-fixed bg-white rounded-lg shadow-xl">
        <thead>
          <tr className="border-b-3 border-light-blue text-black text-sm">
            <th className="py-3 px-2 sm:px-4 w-1/5">S.No</th>
            <th className="py-3 px-2 sm:px-4 w-2/5">Ward</th>
            <th className="py-3 px-2 sm:px-4 w-2/5">100% Bins</th>
          </tr>
        </thead>

        <tbody>
          {wardsdata.map((bin, index) => (
            <tr
              key={index}
              className="border-b-2 border-light-blue text-center text-sm text-light-grey last:border-none"
            >
              <td className="py-2 px-2">{index + 1}</td>
              <td className="py-2 px-2 truncate">{bin.ward}</td>
              <td className="py-2 px-2 font-bold text-red-600">
                {bin.fullBins}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </div>

  {/* 🔥 HOTSPOTS */}
  <div className="bg-lightest-blue rounded-xl border-3 border-white font-roboto-flex">
    <h2 className="text-base font-semibold p-4 text-black">
      Top 10 Hotspots
    </h2>

    <div className="max-h-72 overflow-y-auto">
      <table className="w-full table-fixed bg-white rounded-lg">
        <thead>
          <tr className="border-b-3 border-light-blue text-black text-sm">
            <th className="py-3 px-2 sm:px-4 w-1/5">S.No</th>
            <th className="py-3 px-2 sm:px-4 w-2/5">Location</th>
            <th className="py-3 px-2 sm:px-4 w-2/5">Waste</th>
          </tr>
        </thead>

        <tbody>
          {hotspotdata.map((bin, index) => (
            <tr
              key={index}
              className="border-b-2 border-light-blue text-center text-sm text-light-grey last:border-none"
            >
              <td className="py-2 px-2">{index + 1}</td>
              <td className="py-2 px-2 truncate">{bin.location}</td>
              <td className="py-2 px-2">{bin.waste}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </div>

  {/* 🔥 ESCALATIONS */}
  <div className="bg-lightest-blue rounded-xl border-3 border-white font-roboto-flex">
    <h2 className="text-base font-semibold p-4 text-black">
      Escalation L1–L4
    </h2>

    <div className="max-h-72 overflow-y-auto">
      <table className="w-full table-fixed bg-white rounded-lg">
        <thead>
          <tr className="border-b-3 border-light-blue text-black text-sm">
            <th className="py-3 px-2 sm:px-4 w-1/2">Level</th>
            <th className="py-3 px-2 sm:px-4 w-1/2">Count</th>
          </tr>
        </thead>

        <tbody>
          {escalationdata.map((bin, index) => (
            <tr
              key={index}
              className="border-b-2 border-light-blue text-center text-sm text-light-grey last:border-none"
            >
              <td className="py-2 px-2 font-bold text-orange-600">
                {bin.level}
              </td>
              <td className="py-2 px-2 font-bold">{bin.count}</td>
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