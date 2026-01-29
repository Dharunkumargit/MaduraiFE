import React, { useState } from "react";
import NavBar from "./NavBar";
import { PiShoppingBagOpenBold } from "react-icons/pi";
import { TbBuildingStore, TbReportAnalytics } from "react-icons/tb";
import { LuContact, LuLayoutDashboard } from "react-icons/lu";
import { RiDashboardLine, RiUserAddLine } from "react-icons/ri";
import { GrGroup } from "react-icons/gr";
import { NavLink, Outlet, useLocation } from "react-router";
import { Settings } from "lucide-react";
import { HiOutlineTrash } from "react-icons/hi";
import { MdLocationOn, MdOutlineNotificationAdd } from "react-icons/md";

const LayOut = () => {
  const location = useLocation();
  const [searchTerm, setSearchTerm] = useState("");
  
  // ✅ NEW: Read YOUR exact localStorage structure
  const userData = JSON.parse(localStorage.getItem('user') || '{}');
  
  // ✅ NEW: RBAC Logic - uses your role.accessLevels
  const hasAccess = (featureName) => {
    if (!userData?.role?.accessLevels) return true; // Fallback show all
    
    const feature = userData.role.accessLevels.find(f => 
      f.feature === featureName ||
      f.feature.toLowerCase() === featureName.toLowerCase()
    );
    return feature?.permissions?.length > 0;
  };

  const Menus = [
    {
      title: "Dashboard",
      icon: <RiDashboardLine size={25} />,
      to: "/dashboard",
      feature: "Dashboard" // ✅ NEW: For RBAC
    },
    {
      title: "Location",
      icon: <MdLocationOn size={25} />,
      to: "/location",
      feature: "Location"
    },
    {
      title: "Escalation",
      icon: <MdOutlineNotificationAdd size={25} />,
      to: "/escalation",
      feature: "Escalation"
    },
    {
      title: "Master",
      icon: <LuLayoutDashboard size={25} />,
      to: "/master/zone",
      feature: "master",
      nested: [
        {
          title: "Zone",
          icon: <RiUserAddLine size={23} />,
          to: "/master/zone",
        },
        {
          title: "Ward",
          icon: <RiUserAddLine size={23} />,
          to: "/master/ward",
        },
      ]
    },
    {
      title: "Reports",
      icon: <TbReportAnalytics size={25} />,
      to: "/reports/zonewisereport",
      feature: "Reports",
      nested: [
        {
          title: "Zone-wise Report",
          to: "/reports/zonewisereport",
        },
        {
          title: "Ward-wise Report",
          to: "/reports/wardwisereport",
        },
        {
          title: "Location-wise Report",
          to: "/reports/locationwisereport",
        },
        {
          title: "Employee-wise Report",
          to: "/reports/employeewisereport",
        },
        // {
        //   title: "Escalation Report",
        //   to: "/reports/escalationreport",
        // },
      ]
    },
    {
      title: "Employee Management",
      icon: <LuContact size={25} />,
      to: "/employeemanagement",
      feature: "EmployeeManagement"
    },
    {
      title: "Settings",
      icon: <Settings size={25} />,
      to: "/settings/users",
      feature: "Settings",
      nested: [
        {
          title: "User",
          icon: <RiUserAddLine size={23} />,
          to: "/settings/users",
        },
        {
          title: "Roles",
          icon: <GrGroup size={23} />,
          to: "/settings/roles",
        },
      ],
    },
  ].filter(menu => hasAccess(menu.feature)); // ✅ NEW: Filter by checkboxes

  // ✅ OLD: Your exact functions (unchanged)
  const isMenuActive = (menu) => {
    if (location.pathname.startsWith(menu.to)) {
      return true;
    }
    if (
      menu.nested &&
      menu.nested.some((item) => location.pathname.startsWith(item.to))
    ) {
      return true;
    }
    return false;
  };

  const isMenuActives = (menu) => {
    if (location.pathname.startsWith(menu.to)) {
      return true;
    }
    if (
      menu.nested &&
      menu.nested.some((item) => location.pathname.startsWith(item.to))
    ) {
      return true;
    }
    return false;
  };

  // ✅ NEW: Nested sidebar visibility (your logic + RBAC)
  const isNestedSidebarVisible = (menuTitle, pathname) => {
    if (menuTitle === "Location") {
      return (
        pathname.startsWith("/location/") && pathname !== "/location"
      );
    }
    if (menuTitle === "Escalation") {
      return pathname.startsWith("/escalation/") && pathname !== "/escalation";
    }
    if (menuTitle === "Employee Management") {
      return pathname.startsWith("/employeemanagement/") && pathname !== "/employeemanagement";
    }
    return pathname.startsWith(`/${menuTitle.toLowerCase()}`);
  };

  return (
    <div className=" font-roboto-flex w-full fixed h-screen ">
      <NavBar onSearch={setSearchTerm} />
      <div className="flex bg-light-blue h-11/12 ">
        <div className="px-6 pb-10 bg-light-blue overflow-auto no-scrollbar ">
          <ul>
            {/* ✅ OLD UI + NEW RBAC filter */}
            {Menus.map((menu, index) => (
              <React.Fragment key={index}>
                <NavLink to={menu.to}>
                  <li
                    className={`w-[84px] text-sm font-extralight flex flex-col items-center text-center p-3 my-4  rounded-xl ${
                      isMenuActive(menu)
                        ? " text-white   bg-darkest-blue "
                        : " text-light-grey border border-light-stroke "
                    }`}
                  >
                    <span>{menu.icon}</span>
                    <p>{menu.title}</p>
                  </li>
                </NavLink>
              </React.Fragment>
            ))}
          </ul>
        </div>

        {/* ✅ OLD Nested sidebar logic + NEW RBAC */}
        {Menus.map((menu, index) => {
          const shouldShowSidebar =
            menu.nested &&
            isNestedSidebarVisible(menu.title, location.pathname) &&
            hasAccess(menu.feature); // ✅ NEW: Check access

          return (
            shouldShowSidebar &&
            isMenuActives(menu) && (
              <div
                key={index}
                className="mx-2.5 w-56 text-sm  my-4 rounded-lg bg-white overflow-auto no-scrollbar shadow-lg py-6 mb-10"
              >
                <ul>
                  {menu.nested.map((item, index) => (
                    <li key={index} className="mb-2">
                      <NavLink to={item.to}>
                        <div
                          className={`w-full   flex  items-center gap-2 py-3 px-4 mt-3 cursor-pointer ${
                            location.pathname.startsWith(item.to)
                              ? "bg-light-blue text-black border-r-5 border-r-darkest-blue"
                              : "text-light-grey"
                          }`}
                        >
                          <span>{item.icon}</span>
                          <p>{item.title}</p>
                        </div>
                      </NavLink>
                    </li>
                  ))}
                </ul>
              </div>
            )
          );
        })}

        {/* ✅ OLD Content area - unchanged */}
        <div className="w-full pt-5 ml-3 overflow-auto no-scrollbar ">
          <Outlet context={{ searchTerm }} />
        </div>

   
      </div>
    </div>
  );
};

export default LayOut;
