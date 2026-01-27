import React, { useState } from "react";
import { useNavigate } from "react-router";
import Title from "../../../components/Title";
import { IoSave } from "react-icons/io5";
import { toast } from "react-toastify";
import axios from "axios";
import { API } from "../../../../const";

const AddRoles = () => {
  const [roleName, setRoleName] = useState("");
  const [createdBy, setCreatedBy] = useState("Adminstrator");
  const [selectedSettings, setSelectedSettings] = useState({});
  const [permissions, setPermissions] = useState({});
  const [roles, setRoles] = useState([]);
  const navigate = useNavigate();

  const settingsOptions = [
    "Dashboard",
    "Bins",
    "Escalation",
    "Locality",
    "Reports",
    
    "EmployeeManagement",
    
    "Settings",
  ];

  const permissionOptions = [
    "All",
    "View",
    "Create",
    "Edit",
    "Delete",
    "Download",
  ];

  const toggleSetting = (setting) => {
    setSelectedSettings((prev) => ({
      ...prev,
      [setting]: !prev[setting],
    }));

    setPermissions((prev) => {
      if (prev[setting]) {
        const updated = { ...prev };
        delete updated[setting];
        return updated;
      }
      return { ...prev, [setting]: [] };
    });
  };

  // Handle Permission Changes
  const handlePermissionChange = (setting, permission, checked) => {
    setPermissions((prev) => {
      let updatedPermissions = prev[setting] || [];

      if (permission === "All") {
        updatedPermissions = checked ? permissionOptions.slice(1) : [];
      } else {
        updatedPermissions = checked
          ? [...updatedPermissions, permission]
          : updatedPermissions.filter((p) => p !== permission);

        if (!checked) {
          updatedPermissions = updatedPermissions.filter((p) => p !== "All");
        }
      }

      if (updatedPermissions.length === permissionOptions.length - 1) {
        updatedPermissions = ["All", ...updatedPermissions];
      }

      return { ...prev, [setting]: updatedPermissions };
    });
  };

  const handleSave = async () => {
    if (!roleName.trim()) {
      return toast.error("Role name is required!");
    }

    const hasValidAccess = Object.values(permissions).some(
      (perms) => Array.isArray(perms) && perms.length > 0
    );
    if (!hasValidAccess) {
      return toast.error("Select at least one setting with permissions!");
    }

    const accessLevels = Object.entries(permissions).filter(([_, perms]) => perms.length > 0).map(([feature, perms]) => ({
      feature,
      permissions: perms,
    }));

    const selectedRoleObj = roles.find((r) => r._id === roleName);

    const roleAccessLevel = {
      role_id: selectedRoleObj ? selectedRoleObj._id : null,
      role_name: selectedRoleObj ? selectedRoleObj.role_name : roleName,
      created_by_user: createdBy,
      accessLevels,
      status: "ACTIVE",
    };

    try {
      const response = await axios.post(
        `${API}/roles/addrole`,
        roleAccessLevel
      );

      console.log("Saved role:", response.data);
      toast.success("Role created successfully!");
      setTimeout(() => {
        navigate("/settings/roles");
      }, 800);
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.message || "Something went wrong!");
    }
  };

    

    
    // console.log("Saved role:", {
    //   roleName,
    //   createdBy,
    //   permissions,
    // });
  ;

  return (
    <>
      <div className="flex justify-between items-center  mb-2">
        <Title
          title="Settings"
          sub_title="Roles"
          page_title="Add Roles"
        />
        <div className="flex gap-3 mr-4">
          <p
            onClick={() => navigate("/settings/roles")}
            className="cursor-pointer  border  border-darkest-blue px-8 py-2 rounded-sm"
          >
            Cancel
          </p>
          <p
            onClick={handleSave}
            className="bg-darkest-blue cursor-pointer text-white px-8 py-2 rounded-sm"
          >
            Save
          </p>
        </div>
      </div>
      <div className="flex items-center  gap-10 mb-4">
        <span className="font-semibold  text-black ">Role name</span>
        <input
          type="text"
          value={roleName}
          onChange={(e) => setRoleName(e.target.value)}
          className="  px-3 py-1.5 rounded-md outline-none  bg-white text-black "
        />
        <span className="font-semibold  text-black  ">Created By</span>
        <input
          type="text"
          value={createdBy}
          onChange={(e) => setCreatedBy(e.target.value)}
          className="  px-3 py-1.5 rounded-md outline-none  bg-white text-black "
        />
      </div>

      <div className=" bg-white p-10  rounded-xl mr-4  ">
        <div className="grid grid-cols-3 gap-2 ">
          <div className="border-r-2 p-3 h-80">
            <h2 className="text-lg font-medium mb-4 w-1/2 text-center">
              Settings
            </h2>
            {settingsOptions.map((setting) => (
              <div key={setting} className="flex items-center text-light-grey mb-3">
                <label className="flex items-center gap-3  cursor-pointer">
                  <label className="relative flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={!!selectedSettings[setting]}
                      onChange={() => toggleSetting(setting)}
                      className="appearance-none w-5 h-5 border-2  border-light-grey rounded-md checked:bg-darkest-blue  checked:border-transparent focus:outline-none transition-all duration-200"
                    />
                    {/* Custom Checkmark */}
                    <span className="absolute w-5 h-5 flex justify-center items-center pointer-events-none">
                      {selectedSettings[setting] && (
                        <svg
                          className="w-10 h-4 dark:text-black text-white"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="3"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M5 13l4 4L19 7"
                          ></path>
                        </svg>
                      )}
                    </span>
                  </label>

                  {setting}
                </label>
              </div>
            ))}
          </div>

          <div className="p-3">
            <h2 className="text-lg font-medium mb-3 pl-5">Permissions</h2>
            {settingsOptions.map((setting) => (
              <div key={setting} className=" flex items-center ml-4">
                {selectedSettings[setting] ? (
                  <div className="flex items-center justify-between text-light-grey p-2 rounded-md">
                    <div className="flex gap-6 w-3/4">
                      {permissionOptions.map((perm) => (
                        <label
                          key={perm}
                          className="flex items-center gap-3 cursor-pointer text-sm"
                        >
                          <input
                            type="checkbox"
                            checked={
                              permissions[setting]?.includes(perm) || false
                            }
                            onChange={(e) =>
                              handlePermissionChange(
                                setting,
                                perm,
                                e.target.checked
                              )
                            }
                            className="appearance-none w-5 h-5 border-2 dark:border-white border-light-grey rounded-md checked:bg-darkest-blue checked:border-transparent focus:outline-none transition-all duration-200"
                          />
                          {/* Custom Checkmark */}
                          <span className="absolute w-5 h-5 flex justify-center items-center pointer-events-none">
                            {permissions[setting]?.includes(perm) && (
                              <svg
                                className="w-10 h-4  text-white"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="3"
                                viewBox="0 0 24 24"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  d="M5 13l4 4L19 7"
                                ></path>
                              </svg>
                            )}
                          </span>
                          {perm}
                        </label>
                      ))}
                    </div>
                  </div>
                ) : (
                  <div className="h-9"></div> // Keeps spacing even when unchecked
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
};

export default AddRoles;
