import React, { useCallback, useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router";
import Title from "../../../components/Title";
import { IoSave } from "react-icons/io5";
import { API } from "../../../../const";
import axios from "axios";
import { toast } from "react-toastify";

const EditRoles = () => {
  const [roleName, setRoleName] = useState("");
  const [createdBy, setCreatedBy] = useState("System");
  const [selectedSettings, setSelectedSettings] = useState({});
  const [permissions, setPermissions] = useState({});
  const location = useLocation();
  const roleId = location.state?.item?.role_id; 
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
  
  useEffect(() => {
    if (roleId) {
      fetchExistingRole();
    }
  }, [roleId]);
 const fetchExistingRole = useCallback(async () => {
  try {
    const response = await axios.get(
      `${API}/roles/getrolebyid/${roleId}`
    );

    const role = response.data.data;
    setRoleName(role.role_name);

    const selected = {};
    const perms = {};

    role.accessLevels.forEach(({ feature, permissions }) => {
      selected[feature] = true;

      const allPermsExceptAll = permissionOptions.filter(p => p !== "All");

      const hasAll =
        allPermsExceptAll.every(p => permissions.includes(p));

      perms[feature] = hasAll
        ? ["All", ...allPermsExceptAll]
        : permissions;
    });

    setSelectedSettings(selected);
    setPermissions(perms);
  } catch (error) {
    console.error(error);
    toast.error("Failed to load role data");
  }
}, [roleId]);

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
  setPermissions(prev => {
    let current = prev[setting] || [];

    if (permission === "All") {
      return {
        ...prev,
        [setting]: checked ? permissionOptions : [],
      };
    }

    let updated = checked
      ? [...current.filter(p => p !== "All"), permission]
      : current.filter(p => p !== permission && p !== "All");

    const allPermsExceptAll = permissionOptions.filter(p => p !== "All");

    if (allPermsExceptAll.every(p => updated.includes(p))) {
      updated = ["All", ...allPermsExceptAll];
    }

    return { ...prev, [setting]: updated };
  });
};


  const handleSave = async () => {
  const accessLevels = Object.entries(permissions)
    .filter(([feature]) => selectedSettings[feature])
    .map(([feature, perms]) => ({
      feature,
      permissions: perms.filter(p => p !== "All"),
    }));

  if (!roleName.trim()) {
    return toast.error("Role name is required");
  }

  if (accessLevels.length === 0) {
    return toast.error("Select at least one setting");
  }

  const payload = {
    role_name: roleName.trim(),
    accessLevels,
    status: "ACTIVE",
  };

  try {
    await axios.put(
      `${API}/roles/updaterolebyid?role_id=${roleId}`,
      payload
    );

    toast.success("Role updated successfully");
    navigate("/settings/roles");
  } catch (error) {
    console.error(error);
    toast.error("Failed to update role");
  }
};


  return (
    <>
      <div className="flex justify-between items-center  mb-2">
        <Title
          title="Settings"
          sub_title="Roles"
          page_title="Edit Roles"
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

export default EditRoles;
