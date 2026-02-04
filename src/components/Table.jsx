import React, { useMemo, useState } from "react";
import Title from "./Title";
import Button from "./Button";
import { TbFileExport } from "react-icons/tb";
import { BiFilterAlt } from "react-icons/bi";
import { HiArrowsUpDown } from "react-icons/hi2";
import { RiDeleteBinLine } from "react-icons/ri";
import { LuEye } from "react-icons/lu";
import { Pencil } from "lucide-react";
import * as XLSX from "xlsx";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

import { useNavigate } from "react-router";
import Pagination from "./Pagination";
import Loader from "./Loader";
import axios from "axios";
import { API } from "../../const";

const Table = ({
  title,
  sub_title,
  pagetitle,
  addButtonLabel,
  addButtonIcon,
  addroutepoint,

  contentMarginTop = "mt-4",
  tabledata,
  colomns = [],
  currentPage = 1,        
  itemsPerPage ,
  showEditButton = true,
  showDeleteButton = true,
  showViewButton = true,
  AddModal,
  showActions = true,
  EditModal,
  loading = false,
  onDelete,
  editroutepoint,
  onExportAll,
  onEdit,
  ViewModel,
  routepoint,
}) => {
  const [sortConfig, setSortConfig] = useState({ key: null, direction: "asc" });
  const [showAdd, setShowAdd] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [showEdit, setShowEdit] = useState(false);
  const [showView, setShowView] = useState(false);
  const navigate = useNavigate();
  const [totalPages, setTotalPages] = useState([]);
 
  const [showExport, setShowExport] = useState(false);

  const safeData = Array.isArray(tabledata) ? tabledata : [];
  const sortedItems = useMemo(() => {
    const items = [...safeData];
    if (sortConfig.key) {
      items.sort((a, b) => {
        const aVal = a[sortConfig.key];
        const bVal = b[sortConfig.key];
        if (aVal < bVal) return sortConfig.direction === "asc" ? -1 : 1;
        if (aVal > bVal) return sortConfig.direction === "asc" ? 1 : -1;
        return 0;
      });
    }
    return items;
  }, [safeData, sortConfig]);
  const handleSort = (key) => {
    let direction = "asc";
    if (sortConfig.key === key && sortConfig.direction === "asc") {
      direction = "desc";
    }
    setSortConfig({ key, direction });
  };
  const fetchAllDataForExport = async () => {
  const res = await axios.get(`${API}/bins/getallbins`, {
    params: { export: true },
  });
  return res.data.data || [];
};
  const handleExportExcel = async () => {
  const allData = await fetchAllDataForExport();
  if (!allData.length) return;

  const excelData = allData.map((item) => {
    const row = {};
    colomns.forEach((col) => {
      row[col.label] = item[col.key] ?? "-";
    });
    return row;
  });

  const ws = XLSX.utils.json_to_sheet(excelData);
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, title || "Bins");

  XLSX.writeFile(wb, `${title || "bins"}.xlsx`);
};
  const handleExportPDF = async () => {
  const allData = await fetchAllDataForExport();
  if (!allData.length) return;

  const doc = new jsPDF("l", "mm", "a4");

  const headers = colomns.map((c) => c.label);
  const body = allData.map((row) =>
    colomns.map((c) => row[c.key] ?? "-")
  );

  doc.text(title || "Bins", 14, 10);

  autoTable(doc, {
    head: [headers],
    body,
    startY: 15,
    styles: { fontSize: 7 },
  });

  doc.save(`${title || "bins"}.pdf`);
};

  return (
    <div>
      <div className="font-roboto-flex flex flex-col h-full">
        <div className="lg:flex lg:justify-between">
          <Title title={title} sub_title={sub_title} page_title={pagetitle} />
          <div className="my-2 flex flex-wrap items-center gap-2 mr-4">
            {addButtonLabel && (
              <div className=" flex flex-wrap items-center mr-1">
                <Button
                  button_name={addButtonLabel}
                  button_icon={addButtonIcon}
                  onClick={() => {
                    if (addroutepoint) {
                      navigate(`${addroutepoint}`);
                    }
                    if (AddModal === true) {
                      setShowAdd(false);
                    } else {
                      setShowAdd(true);
                    }
                  }}
                />
              </div>
            )}

            <div className="">
              <Button
                button_icon={<TbFileExport size={22} />}
                button_name="Export"
                bgColor="bg-white"
                textColor="text-black"
                paddingX="px-4"
                onClick={() => setShowExport((prev) => !prev)}
              />

              {showExport && (
                <div className="absolute right-0 mt-2 w-40 bg-white border rounded shadow-md z-50 mr-5">
                  <button
                    onClick={() => {
                      setShowExport(false);
                      handleExportExcel();
                    }}
                    className="w-full px-4 py-2 text-left hover:bg-gray-100"
                  >
                    Export to Excel
                  </button>

                  <button
                    onClick={() => {
                      setShowExport(false);
                      handleExportPDF();
                    }}
                    className="w-full px-4 py-2 text-left hover:bg-gray-100"
                  >
                    Export to PDF
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
        <div
          className={`${contentMarginTop} overflow-y-auto no-scrollbar h-11/12`}
        >
          <div className="overflow-auto no-scrollbar mr-5">
            <table className="w-full whitespace-nowrap text-center">
              <thead>
                <tr className="font-semibold text-sm bg-white border-b-4 border-b-light-blue   h-15 ">
                  <th className="p-3.5 rounded-l-lg">S.no</th>
                  {colomns.map((col, index) => {
                    const isLastColumn = index === colomns.length - 1;
                    const hasAction = EditModal || ViewModel;

                    const addRightRadius = isLastColumn && !hasAction;

                    return (
                      <th
                        key={col.key}
                        className={`p-3.5 ${
                          addRightRadius ? "rounded-r-lg" : ""
                        }  cursor-pointer`}
                        onClick={() => handleSort(col.key)}
                      >
                        <div className="flex items-center justify-center gap-2">
                          {col.label}{" "}
                          <HiArrowsUpDown
                            onClick={() => {
                              let direction = "asc";
                              if (
                                sortConfig.key === col.key &&
                                sortConfig.direction === "asc"
                              ) {
                                direction = "desc";
                              }
                              setSortConfig({ key: col.key, direction });
                            }}
                            size={18}
                            className={
                              sortConfig.key === col.key
                                ? sortConfig.direction === "asc"
                                  ? "rotate-180"
                                  : ""
                                : ""
                            }
                          />
                        </div>
                      </th>
                    );
                  })}
                  {(showActions || EditModal || ViewModel) && (
                    <th className="pr-2 text-center rounded-r-lg">Action</th>
                  )}
                </tr>
              </thead>
              <tbody className="text-light-grey bg-white   text-sm font-light">
                {loading ? (
                  <tr>
                    <td
                      colSpan={colomns.length + 2}
                      className="text-center py-8"
                    >
                      <Loader />
                    </td>
                  </tr>
                ) : sortedItems.length > 0 ? (
                  sortedItems.map((item, index) => (
                    <tr
                      key={index}
                      className="border-b-3 border-light-blue text-center justify-center "
                    >
                      <td className="p-1 text-center rounded-l-lg">
                        {(currentPage - 1) * itemsPerPage + index + 1}
                      </td>
                      {colomns.map((col, colIndex) => {
                        const value =
                          item[col.key] !== undefined ? item[col.key] : "-";
                        const keyName = col.key.toLowerCase();
                        const isStatusCol = keyName === "status";
                        const isFilledCol = keyName === "filled";
                        const isEscalationLevel = keyName === "visibleEscalations";

                        const filledValue =
                          isFilledCol && typeof value === "string"
                            ? parseFloat(value.replace("%", ""))
                            : value;

                        return (
                          <td key={colIndex} className="p-3.5">
                            {isStatusCol ? (
                              <span
                                className={`text-sm ${
                                  value.trim().toLowerCase() === "resolved"
                                    ? "text-green-600"
                                    : ""
                                }`}
                              >
                                {value}
                              </span>
                            ) : isFilledCol ? (
                              <span
                                className={`font-medium ${
                                  filledValue > 75
                                    ? "text-red-700"
                                    : filledValue <= 49
                                      ? "text-green-700"
                                      : "text-yellow-600"
                                }`}
                              >
                                {value}
                              </span>
                            ) : isEscalationLevel ? (
                              <span className="text-red-600 font-medium">
                                {value}
                              </span>
                            ) : (
                              value
                            )}
                          </td>
                        );
                      })}
                      {(showActions ||
                        EditModal ||
                        ViewModel ||
                        routepoint) && (
                        <td className="p-1 pr-4 text-center rounded-r-lg">
                          <div className="flex items-center justify-center gap-2">
                            {showEditButton && (
                              <button
                                onClick={() => {
                                  if (editroutepoint) {
                                    navigate(`${editroutepoint}`, {
                                      state: { item },
                                    });
                                  }
                                  if (EditModal === true) {
                                    setShowEdit(false);
                                  } else {
                                    setSelectedItem(item);
                                    setShowEdit(true);
                                  }
                                }}
                                className="cursor-pointer bg-[#C9E0FF] p-1.5 rounded"
                              >
                                <Pencil size={14} className="text-blue-500" />
                              </button>
                            )}
                            {showViewButton && (
                              <button
                                onClick={() => {
                                  if (routepoint) {
                                    navigate(`${routepoint}`, {
                                      state: { item },
                                    });
                                  }
                                  if (ViewModel === true) {
                                    setShowView(false);
                                  } else {
                                    setSelectedItem(item);
                                    setShowView(true);
                                  }
                                }}
                                className="cursor-pointer bg-[#BAFFBA] p-1.5 rounded"
                              >
                                <LuEye size={14} className="text-[#008000]" />
                              </button>
                            )}
                            {showDeleteButton && (
                              <button
                                onClick={() => onDelete(item._id)}
                                className="cursor-pointer bg-red-100 p-1.5 rounded-sm"
                              >
                                <RiDeleteBinLine
                                  size={16}
                                  className="text-red-600"
                                />
                              </button>
                            )}
                          </div>
                        </td>
                      )}
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan={colomns.length + 2}
                      className="  text-center py-4"
                    >
                      No data available
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
      {/* <Pagination
        totalItems={sortedItems.length}
        itemsPerPage={itemsPerPage}
        currentPage={currentPage}
        totalPages={totalPages}
        setCurrentPage={setCurrentPage}
      /> */}
      {AddModal && showAdd && <AddModal onclose={() => setShowAdd(false)} />}
      {EditModal && showEdit && (
        <EditModal onclose={() => setShowEdit(false)} item={selectedItem} />
      )}
      {ViewModel && showView && (
        <ViewModel onclose={() => setShowView(false)} item={selectedItem} />
      )}
    </div>
  );
};

export default Table;
