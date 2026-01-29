import React from "react";
import { BrowserRouter, Routes, Route } from "react-router";

import LayOut from "../layouts/LayOut";
import Dashboard from "../pages/dashboard/Dashboard";
import Bins from "../pages/bins/Bins";
import Escalation from "../pages/escalation/Escalation";
import Locality from "../pages/locality/Locality";
import Reports from "../pages/reports/Reports";
import EmployeeManagement from "../pages/employeemanagement/EmployeeManagement";
import { Settings } from "lucide-react";
import Roles from "../pages/settings/roles/Roles";
import User from "../pages/settings/user/User";
import Zone from "../pages/locality/zone/Zone";
import Login from "../pages/auth/Login";
import ForgotPassword from "../pages/auth/ForgetPassword";
import ResetPassword from "../pages/auth/ResetPassword";
import Ward from "../pages/locality/ward/Ward";
import EditUser from "../pages/settings/user/EditUser";
import EditRoles from "../pages/settings/roles/EditRoles";
import ViewBins from "../pages/bins/ViewBins";
import ViewEsclation from "../pages/escalation/ViewEsclation";
import Zonewisereport from "../pages/reports/zonewisereport/Zonewisereport";
import Wardwiaereport from "../pages/reports/wardwisereport/Wardwiaereport";
import Binwisereport from "../pages/reports/binwisereport/Binwisereport";
import Employeewisereport from "../pages/reports/employeewisereport/Employeewisereport";
import Escalationreport from "../pages/reports/escalationreport/Escalationreport";
import ViewEmployeeManagement from "../pages/employeemanagement/ViewEmployeeManagement";
import Profile from "../pages/dashboard/profile/Profile";
import AddRoles from "../pages/settings/roles/AddRoles";

const Approutes = () => {
  return (
    <div>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Login />} />
          {/* <Route path="/forgotpassword" element={<ForgotPassword />} /> */}
          <Route path="/resetpassword" element={<ResetPassword />} />
          <Route path="/" element={<LayOut />}>
            <Route path="/dashboard" >
              <Route index element={<Dashboard />} />
              <Route path="profile" element={<Profile />} />
            </Route>
            <Route path="/location">
              <Route index element={<Bins />} />
              <Route path="viewlocation" element={<ViewBins />} />
            </Route>
            <Route path="/escalation">
              <Route index element={<Escalation />} />
              <Route path="viewescalation" element={<ViewEsclation />} />
            </Route>
            <Route path="/master">
              <Route path="zone">
                <Route index element={<Zone />} />
              </Route>
              <Route path="ward">
                <Route index element={<Ward />} />
              </Route>
            </Route>
            <Route path="/reports">
              <Route path="zonewisereport">
                <Route index element={<Zonewisereport />} />
              </Route>
              <Route path="wardwisereport">
                <Route index element={<Wardwiaereport />} />
              </Route>
              <Route path="locationwisereport">
                <Route index element={<Binwisereport />} />
              </Route>
              <Route path="employeewisereport">
                <Route index element={<Employeewisereport />} />
              </Route>
              <Route path="escalationreport">
                <Route index element={<Escalationreport />} />
              </Route>
            </Route>
            <Route path="/employeemanagement">
              <Route index element={<EmployeeManagement />} />
              
            </Route>
            <Route path="/settings">
              <Route path="users">
                <Route index element={<User />} />
                <Route path="edituser" element={<EditUser />} />
              </Route>
              <Route path="roles">
                <Route index element={<Roles />} />
                <Route path="addroles" element={<AddRoles />} />
                <Route path="editroles" element={<EditRoles />} />
              </Route>
            </Route>
          </Route>
        </Routes>
      </BrowserRouter>
    </div>
  );
};

export default Approutes;
