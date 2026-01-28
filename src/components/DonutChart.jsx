import { useState } from "react";
import { HiChevronDown } from "react-icons/hi";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts";

const DonutChart = ({
  title = "Donut Chart",
  data = [],
  colors = [],
  height = 180,
  outerRadius = 70,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selected, setSelected] = useState("Zone");

  const options = ["Month", "Quarter", "Year"];

  return (
    <div className="bg-lightest-blue border-3 border-white rounded-xl p-5 h-80">
      <div className="flex justify-between items-center">
        <h3 className="text-base font-semibold text-gray-800">{title}</h3>

        <div className="relative w-32 text-sm">
          {/*           
          <button
            onClick={() => setIsOpen((prev) => !prev)}
            className="w-full h-9 flex justify-between items-center pl-3 rounded-md bg-white shadow-sm text-gray-600"
          >
            {selected}
            <span className="flex items-center justify-center bg-[#D0D6FF] w-9 h-9 rounded-r-md">
              <HiChevronDown
                size={18}
                className={`transition-transform duration-200 ${
                  isOpen ? "rotate-180" : ""
                }`}
              />
            </span>
          </button> */}

          {isOpen && (
            <ul className="absolute z-10 mt-1 w-full bg-white border border-[#cdd3ff] rounded-md shadow text-gray-700">
              {options.map((option) => (
                <li
                  key={option}
                  onClick={() => {
                    setSelected(option);
                    setIsOpen(false);
                  }}
                  className={`px-3 py-2 cursor-pointer hover:bg-[#eef0ff] ${
                    option === selected ? "font-semibold text-[#4c52ff]" : ""
                  }`}
                >
                  {option}
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>

      <div className="flex justify-evenly items-center mt-7">
        <div className="w-[70%] h-50">
          <ResponsiveContainer width="100%" height={height}>
            <PieChart>
              <Pie
                data={data}
                dataKey="value"
                nameKey="name"
                innerRadius={50}
                outerRadius={outerRadius}
                paddingAngle={2}
                cornerRadius={8}
              >
                {data.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={colors[index % colors.length]}
                    stroke="none"
                  />
                ))}
              </Pie>
              <Tooltip
                formatter={(value) => [`${value} Tons`, "Total Waste"]} // 🔥 SHOWS "3 Tons"
                labelFormatter={(label) => `Zone: ${label}`} // 🔥 "Zone: Zone 1"
              />
            </PieChart>
          </ResponsiveContainer>
        </div>

        <div className="flex flex-col gap-2 mr-6 text-sm">
          {data.map((entry, index) => (
            <div key={index} className="flex items-center gap-2">
              <span
                className="w-3 h-3 rounded-full"
                style={{ backgroundColor: colors[index % colors.length] }}
              ></span>
              <span className="text-gray-700">{entry.name}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default DonutChart;
