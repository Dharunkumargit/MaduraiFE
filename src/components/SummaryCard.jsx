const SummaryCard = ({ status, value, title, icon, onClick, clickable = false }) => (
  <div
    onClick={clickable ? onClick : undefined}
    className="bg-lightest-blue  border-3 border-white  rounded-xl p-4   w-full"
  >
    <div className="border-l-4 px-4 border-[#81B3B8] rounded  flex items-center gap-5 whitespace-nowrap">
      <div className="space-y-2">
        <p className="text-xs text-[#008000]">{status}</p>
        <h2 className="font-semibold">{value}</h2>
      </div>
      <div className="bg-white px-2 py-2 rounded-lg text-[#2A848D]  ">
        {icon}
      </div>
    </div>
    <p className="text-xs text-light-grey mt-4">{title}</p>
  </div>
);
export default SummaryCard;