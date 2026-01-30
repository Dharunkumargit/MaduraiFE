import React, { useEffect, useState } from "react";
import logo from "../../../assets/images/MaduraiLogo.png";
import { IoMdArrowDropdown } from "react-icons/io";
import Title from "../../../components/Title";
import axios from "axios";
import { API } from "../../../../const";


const Employeewisereport = () => {
  const [reportData, setReportData] = useState([]);
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [loading, setLoading] = useState(false);

  const fetchEmployeeReport = async () => {
    try {
      setLoading(true);

      const res = await axios.get(
        `${API}/employee/employeereport`,
        {
          params: { fromDate, toDate }
        }
      );

      setReportData(res.data.data || []);
    } catch (error) {
      console.error("Error fetching employee-wise report:", error);
    } finally {
      setLoading(false);
    }
  };

  // Initial load
  useEffect(() => {
    fetchEmployeeReport();
  }, []);

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-4 mr-4">
        <Title title="Reports" sub_title="Table" page_title="Reports" />

        <div className="flex items-center space-x-3">
          <input
            type="date"
            className="bg-white rounded-md px-4 py-3 focus:outline-none"
            value={fromDate}
            onChange={(e) => setFromDate(e.target.value)}
          />

          <input
            type="date"
            className="bg-white rounded-md px-4 py-3 focus:outline-none"
            value={toDate}
            onChange={(e) => setToDate(e.target.value)}
          />

          <button className="flex items-center bg-white rounded-md px-4 py-3 text-gray-700">
            Export <IoMdArrowDropdown className="ml-1" />
          </button>

          <button
            onClick={fetchEmployeeReport}
            className="bg-darkest-blue text-white rounded-md px-5 py-3"
          >
            Continue
          </button>
        </div>
      </div>

      {/* Report Header */}
      <div className="bg-white rounded-t-lg pl-10 pt-5 ml-5 mr-7 pr-10">
        <div className="flex items-center justify-between">
          <img src={logo} alt="Logo" className="w-22 rounded-full" />

          <div className="text-center">
            <h2 className="text-xl font-semibold">Employee-wise Report</h2>
            {fromDate && toDate && (
              <p className="text-gray-500 text-sm">
                {fromDate} - {toDate}
              </p>
            )}
          </div>

          <div className="text-right">
            <p className="text-sm font-medium">
              <span className="font-semibold">Date:</span>{" "}
              {new Date().toLocaleDateString()}
            </p>
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
                <th className="border p-4">Employee Name</th>
                <th className="border p-4">Assingnes Zone/Ward</th>
                <th className="border p-4">Task Assingned</th>
                <th className="border p-4">Task Completed</th>
                {/* <th className="border p-4">Average Cleaning Time</th>
                <th className="border p-4">TAT Compliance (%)</th> */}
                <th className="border p-4">No. of Escalations</th>
                <th className="border p-4">
                  Total Garbage Collected (Tons)
                </th>
              </tr>
            </thead>

            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="9" className="text-center py-6">
                    Loading...
                  </td>
                </tr>
              ) : reportData.length === 0 ? (
                <tr>
                  <td colSpan="9" className="text-center py-6">
                    No data found
                  </td>
                </tr>
              ) : (
                reportData.map((item, index) => (
                  <tr key={index} className="text-center text-input-grey">
                    <td className="border p-4">{index + 1}</td>
                    <td className="border p-4">{item.employeename}</td>
                    <td className="border p-4">{item.assignedzone}</td>
                    <td className="border p-4">{item.taskassigned}</td>
                    <td className="border p-4">{item.taskcompleted}</td>
                    <td className="border p-4">
                      {item.averagecleaningtime}
                    </td>
                    <td className="border p-4">{item.compliance}</td>
                    <td className="border p-4">{item.escalations}</td>
                    <td className="border p-4">{item.garbage}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        <p className="text-center text-input-grey text-sm py-4">
          Report generated on {new Date().toLocaleDateString()} &nbsp; Powered by{" "}
          <span className="font-semibold">
            Madurai Municipal Corporation
          </span>
        </p>
      </div>
    </div>
  );
};

export default Employeewisereport;
