import React, { useEffect, useState } from "react";
import axios from "axios";
import logo from "../../../assets/images/MaduraiLogo.png";
import { IoMdArrowDropdown } from "react-icons/io";
import Title from "../../../components/Title";
import { API } from "../../../../const";
import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";

const Binwisereport = () => {
  const today = new Date().toISOString().split("T")[0];
  
  const formatDisplayDate = (dateStr) => {
    if (!dateStr) return "";
    const date = new Date(dateStr);
    return date.toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  };

  const [fromDate, setFromDate] = useState(today);
  const [toDate, setToDate] = useState(today);
  const [binsData, setBinsData] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchBinReport = async () => {
    try {
      setLoading(true);
      const from = fromDate || today;
      const to = toDate || today;

      const res = await axios.get(
        `${API}/binfullevents/binwise?from=${from}&to=${to}`
      );
      console.log(res);
      
      if (res.data.success) {
        setBinsData(
          res.data.data.map((bin) => ({
            binid: bin.binid,
            ward: bin.ward,
            zone: bin.zone,
            location: bin.location,
            capacity: bin.capacity,
            tonsCleared: bin.tonsCleared,
            responseTime: bin.avgResponseTime,
          }))
        );
      }
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBinReport();
  }, [fromDate, toDate]);

  // 🔥 PDF Export - EXACT SAME AS WARDWISE
  const exportPDF = () => {
    const doc = new jsPDF();
    doc.text("Bin-wise Waste Management Report", 14, 16);
    
    autoTable(doc, {
      startY: 25,
      head: [["S.no", "Location ID", "Ward", "Zone", "Location", "Capacity", "Tons Cleared", "Response Time"]],
      body: binsData.map((item, index) => [
        index + 1,
        item.binid,
        item.ward,
        item.zone,
        item.location,
        `${item.capacity}L`,
        `${item.tonsCleared}T`,
        `${item.responseTime} mins`
      ])
    });
    
    doc.save(`BinReport_${fromDate}_to_${toDate}.pdf`);
  };

  // 🔥 Excel Export - EXACT SAME AS WARDWISE
  const exportExcel = () => {
    const data = binsData.map((item, index) => ({
      "S.no": index + 1,
      "Bin ID": item.binid,
      "Ward": item.ward,
      "Zone": item.zone,
      "Location": item.location,
      "Capacity": `${item.capacity}L`,
      "Tons Cleared": `${item.tonsCleared}T`,
      "Response Time": `${item.responseTime} mins`
    }));
    
    const ws = XLSX.utils.json_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "BinReport");
    const buf = XLSX.write(wb, { type: "array", bookType: "xlsx" });
    saveAs(new Blob([buf]), `BinReport_${fromDate}_to_${toDate}.xlsx`);
  };

  return (
    <div>
      {/* Header - EXACT SAME LAYOUT AS WARDWISE */}
      <div className="flex items-center justify-between mb-4 mr-4">
        <div>
          <Title title="Reports" sub_title="Table" page_title="Reports" />
        </div>

        <div className="flex items-center space-x-3">
          <input
            type="date"
            className="bg-white rounded-md px-4 py-3"
            value={fromDate}
            onChange={(e) => setFromDate(e.target.value)}
          />
          <input
            type="date"
            className="bg-white rounded-md px-4 py-3"
            value={toDate}
            onChange={(e) => setToDate(e.target.value)}
          />

          {/* 🔥 SEPARATE PDF BUTTON - SAME AS WARDWISE */}
          <button 
            className="flex items-center bg-white rounded-md px-4 py-3 text-gray-700" 
            onClick={exportPDF}
          >
            Export PDF <IoMdArrowDropdown className="ml-1" />
          </button>

          {/* 🔥 SEPARATE EXCEL BUTTON - SAME AS WARDWISE */}
          <button 
            className="flex items-center bg-white rounded-md px-4 py-3 text-gray-700" 
            onClick={exportExcel}
          >
            Export Excel <IoMdArrowDropdown className="ml-1" />
          </button>
        </div>
      </div>

      {/* Header Card */}
      <div className="bg-white rounded-t-lg pl-10 pt-5 h-34 ml-5 mr-7 pr-10">
        <div className="flex items-center justify-between">
          <img src={logo} alt="Logo" className="w-22 rounded-full" />
          <div className="text-center">
            <h2 className="text-xl font-semibold">Location-wise Report</h2>
            <p className="text-gray-500 text-sm">
              {formatDisplayDate(fromDate)} - {formatDisplayDate(toDate)}
            </p>
          </div>
          <div className="text-right text-sm">
            <span className="font-semibold">Date:</span>{" "}
            {new Date().toLocaleDateString("en-IN")}
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-b-lg pt-2 ml-5 mr-7 mt-1.5 mb-13">
        <div className="overflow-x-auto no-scrollbar">
          <table className="w-full border border-light-grey text-sm text-black">
            <thead className="bg-[#EBEBEB]">
              <tr>
                <th className="border p-4">S.no</th>
                <th className="border p-4">Location ID</th>
                <th className="border p-4">Ward</th>
                <th className="border p-4">Zone</th>
                <th className="border p-4">Location</th>
                <th className="border p-4">Capacity</th>
                <th className="border p-4">Tons Cleared</th>
                <th className="border p-4">Response Time</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="8" className="text-center p-8 text-gray-500">
                    <div className="flex flex-col items-center space-y-2">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
                      <span>Loading bin data...</span>
                    </div>
                  </td>
                </tr>
              ) : binsData.length > 0 ? (
                binsData.map((item, index) => (
                  <tr
                    key={item._id || item.binid || index}
                    className="text-center text-input-grey hover:bg-gray-50"
                  >
                    <td className="border p-3">{index + 1}</td>
                    <td className="border p-3 font-medium">{item.binid}</td>
                    <td className="border p-3">{item.ward}</td>
                    <td className="border p-3">{item.zone}</td>
                    <td className="border p-3  max-w-xs truncate">
                      {item.location}
                    </td>
                    <td className="border p-3 font-medium">{item.capacity}L</td>
                    <td className="border p-3 font-bold text-green-600">
                      <strong>{item.tonsCleared}T</strong>
                    </td>
                    <td className=" p-3 font-semibold  ">
                      {item.responseTime} mins
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="8" className="text-center p-8 text-gray-500">
                    <div className="space-y-2">
                      <div className="text-2xl mx-auto w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center">
                        📊
                      </div>
                      <p>No collection data for selected date</p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        <p className="text-center text-input-grey text-sm py-4">
          Report generated on {new Date().toLocaleDateString("en-IN")} | Powered by{" "}
          <span className="font-semibold">Madurai Municipal Corporation</span>
        </p>
      </div>
    </div>
  );
};

export default Binwisereport;
