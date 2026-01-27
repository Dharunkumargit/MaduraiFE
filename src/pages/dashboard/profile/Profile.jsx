import React, { useState } from "react";
import Edit_profile from "./Edit_profile";
import Update_Password from "./Update_Password";
import logo from "../../../assets/images/Profile2.png";

const Profile = () => {
  const [activeSection, setActiveSection] = useState("editProfile");
  const [user, setUser] = useState(() => {
    const stored = localStorage.getItem("user");
    return stored ? JSON.parse(stored) : null;
  });

  const handleProfileSave = (data) => {
    // Update user state with new data
    const updatedUser = {
      ...user,
      name: data.name,
      email: data.email,
      phonenumber: data.phonenumber,
    };

    // Update state
    setUser(updatedUser);

    // Update localStorage
    localStorage.setItem("user", JSON.stringify(updatedUser));
  };

  if (!user) {
    return (
      <div className="p-6 bg-white">
        <p>Please log in to view your profile.</p>
      </div>
    );
  }

  return (
    <div className="p-6 bg-white mb-14 mr-4">
      <h1 className="text-2xl font-bold">My Profile</h1>
      <p className="text-sm text-light-grey">
        Manage your personal details and account settings.
      </p>

      <div className="flex flex-col md:flex-row gap-8 mt-7">
        <div className="shadow-md rounded-lg p-6 flex flex-col items-center h-120">
          <img
            src={logo}
            alt="avatar"
            className="w-40 h-40 rounded-full mb-4"
          />

          <h2 className="text-lg font-semibold">{user.name}</h2>
          <p className="text-sm text-light-grey">   {user.role?.role_name || user.role || "User"}</p>
          <p className="text-sm text-light-grey">{user.email}</p>
          

          <div className="flex gap-3 mt-4">
            <button
              onClick={() => setActiveSection("editProfile")}
              className={`px-4 py-2 rounded-md ${
                activeSection === "editProfile"
                  ? "bg-darkest-blue text-white"
                  : "bg-gray-100"
              }`}
            >
              Edit Profile
            </button>

            <button
              onClick={() => setActiveSection("updatePassword")}
              className={`px-4 py-2 rounded-md ${
                activeSection === "updatePassword"
                  ? "bg-darkest-blue text-white"
                  : "bg-gray-100"
              }`}
            >
              Update Password
            </button>
          </div>
        </div>

        <div>
          {activeSection === "editProfile" ? (
            <Edit_profile user={user} onSave={handleProfileSave} />
          ) : (
            <Update_Password user={user} />
          )}
        </div>
      </div>
    </div>
  );
};

export default Profile;