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

const Employeewisereport = () => {
  const today = new Date().toISOString().split("T")[0];

  const formatDisplayDate = (dateStr) => {
    if (!dateStr) return "";
    return new Date(dateStr).toLocaleDateString("en-IN");
  };

  const [fromDate, setFromDate] = useState(today);
  const [toDate, setToDate] = useState(today);
  const [reportData, setReportData] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchEmployeeReport = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`${API}/employee/employeereport`, {
        params: { fromDate, toDate },
      });
    
      if (res.data.success) {
        setReportData(res.data.data);
      }
    } catch (error) {
      console.error("Employee report error:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEmployeeReport();
  }, [fromDate, toDate]);

  // 🔥 PDF Export (Same style as Bin-wise)
  const exportPDF = () => {
    const doc = new jsPDF();
    doc.text("Employee-wise Waste Management Report", 14, 16);

    autoTable(doc, {
      startY: 25,
      head: [[
        "S.no",
        "Employee Name",
        "Assigned Zone/Ward",
        "Tasks Assigned",
        "Tasks Completed",
        "Escalations",
        "Garbage Collected"
      ]],
      body: reportData.map((item, index) => [
        index + 1,
        item.employeename,
        item.assignedzone,
        item.taskassigned,
        item.taskcompleted,
        item.escalations,
        item.garbage
      ])
    });

    doc.save(`EmployeeReport_${fromDate}_to_${toDate}.pdf`);
  };

  // 🔥 Excel Export
  const exportExcel = () => {
    const data = reportData.map((item, index) => ({
      "S.no": index + 1,
      "Employee Name": item.employeename,
      "Assigned Zone/Ward": item.assignedzone,
      "Tasks Assigned": item.taskassigned,
      "Tasks Completed": item.taskcompleted,
      "Escalations": item.escalations,
      "Garbage Collected": item.garbage
    }));

    const ws = XLSX.utils.json_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "EmployeeReport");

    const buf = XLSX.write(wb, { type: "array", bookType: "xlsx" });
    saveAs(new Blob([buf]), `EmployeeReport_${fromDate}_to_${toDate}.xlsx`);
  };

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-4 mr-4">
        <Title title="Reports" sub_title="Table" page_title="Reports" />

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

          <button
            className="flex items-center bg-white rounded-md px-4 py-3"
            onClick={exportPDF}
          >
            Export PDF <IoMdArrowDropdown className="ml-1" />
          </button>

          <button
            className="flex items-center bg-white rounded-md px-4 py-3"
            onClick={exportExcel}
          >
            Export Excel <IoMdArrowDropdown className="ml-1" />
          </button>
        </div>
      </div>

      {/* Report Header */}
      <div className="bg-white rounded-t-lg pl-10 pt-5 ml-5 mr-7 pr-10">
        <div className="flex items-center justify-between">
          <img src={logo} alt="Logo" className="w-22 rounded-full" />

          <div className="text-center">
            <h2 className="text-xl font-semibold">Employee-wise Report</h2>
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
        <table className="w-full border text-sm">
          <thead className="bg-[#EBEBEB]">
            <tr>
              <th className="border p-4">S.no</th>
              <th className="border p-4">Employee Name</th>
              <th className="border p-4">Assigned Zone/Ward</th>
              <th className="border p-4">Tasks Assigned</th>
              <th className="border p-4">Tasks Completed</th>
              <th className="border p-4">Escalations</th>
              <th className="border p-4">Garbage Collected</th>
            </tr>
          </thead>

          <tbody>
            {loading ? (
              <tr>
                <td colSpan="7" className="text-center p-8">Loading...</td>
              </tr>
            ) : reportData.length > 0 ? (
              reportData.map((item, index) => (
                <tr key={index} className="text-center text-light-grey">
                  <td className="border p-3">{index + 1}</td>
                  <td className="border p-3">{item.employeename}</td>
                  <td className="border p-3">{item.assignedzone}</td>
                  <td className="border p-3">{item.taskassigned}</td>
                  <td className="border p-3">{item.taskcompleted}</td>
                  <td className="border p-3">{item.escalations}</td>
                  <td className="border p-3">{item.garbage}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="7" className="text-center p-8">
                  No data for selected date
                </td>
              </tr>
            )}
          </tbody>
        </table>

        <p className="text-center text-sm py-4">
          Powered by <strong>Madurai Municipal Corporation</strong>
        </p>
      </div>
    </div>
  );
};

export default Employeewisereport;
