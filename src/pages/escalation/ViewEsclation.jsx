import React from "react";
import Title from "../../components/Title";
import { TbFileExport } from "react-icons/tb";
import { BiFilterAlt } from "react-icons/bi";
import Button from "../../components/Button";
import { useLocation } from "react-router";
import logo from "../../assets/images/Location.png";
import bin1 from "../../assets/images/bin1.png";
import bin2 from "../../assets/images/bin2.png";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";

const ViewEsclation = () => {
  const { state } = useLocation();
  const user = state?.item;
  if (!user) {
    return <p className="p-4">No user data found.</p>;
  }
  const staticLat = 9.9252;
  const staticLong = 78.1198;

  const mainFields = [
    { label: "Bin ID", value: user.binid },
    { label: "Ward", value: user.ward },
    { label: "Zone", value: user.zone },
    // { label: "Engineer", value: user.engineer },
    { label: "Escalation Level", value: user.filled },
    { label: "Location", value: "Arappalayam" },
    { label: "Last Alerted", value: "10.00 am" },
    // { label: "Bins", value: "5" },
    { label: "Latest Photos", value: user.lastestphotos },
  ];

  return (
    <div>
      <div className="flex justify-between ">
        <Title title="Dashboard" page_title="Escalation" sub_title="Table" />
        
      </div>
      <div className="bg-lightest-blue p-4 rounded-2xl space-y-3 border-4 border-white text-sm mt-4 mr-4">
        <div className="grid grid-cols-11 gap-2 items-center mt-1">
          {mainFields.map((field, idx) => (
            <React.Fragment key={idx}>
              <p className="col-span-4 font-medium">{field.label}</p>
              <div className="col-span-6 text-light-grey">
                {field.label === "Location" ? (
                  <div className="space-y-2">
                    <MapContainer
                      center={[staticLat, staticLong]}
                      zoom={14}
                      style={{ height: "200px", width: "60%" }}
                    >
                      <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

                      <Marker position={[staticLat, staticLong]}>
                        <Popup></Popup>
                      </Marker>
                    </MapContainer>

                    <p className="text-sm text-light-grey font-medium">
                      {field.value}
                    </p>
                  </div>
                ) : field.label === "Latest Photos" ? (
                  <div className="flex gap-4 mt-2">
                    <img
                      src={bin1}
                      alt="Bin Photo 1"
                      className="w-25 h-25 object-cover rounded-lg shadow"
                    />
                    <img
                      src={bin2}
                      alt="Bin Photo 2"
                      className="w-25 h-25 object-cover rounded-lg shadow"
                    />
                  </div>
                ) : (
                  <span
                    className={`text-sm ${
                      field.label === "Escalation Level" &&
                      field.value === "Level 1"
                        ? "text-red-600 font-medium"
                        : "text-light-grey font-medium"
                    }`}
                  >
                    {field.value}
                  </span>
                )}
              </div>
            </React.Fragment>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ViewEsclation;
