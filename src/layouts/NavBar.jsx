import LOGO from "../assets/images/MaduraiLogo.png";
import { Search } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router";
import { toast } from "react-toastify";

const NavBar = ({ onSearch }) => {
  const navigate = useNavigate();

  const [userInitials, setUserInitials] = useState("U");
  const [userName, setUserName] = useState("User");
  const [showDropdown, setShowDropdown] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  const dropdownRef = useRef(null);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");

    if (storedUser) {
      const user = JSON.parse(storedUser);

      if (user?.name) {
        setUserName(user.name);
        setUserInitials(
          user.name
            .split(" ")
            .map((w) => w[0])
            .join("")
            .slice(0, 2)
            .toUpperCase()
        );
      } else if (user?.email) {
        setUserName(user.email.split("@")[0]);
        setUserInitials(user.email.slice(0, 2).toUpperCase());
      }
    }
  }, []);

  
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setShowDropdown(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = () => {
    localStorage.clear();
    toast.success("Logged out successfully");
    navigate("/");
  };

  return (
    <>
      {/* NAVBAR */}
      <div className="w-full z-10 font-roboto-flex flex justify-between items-center bg-white px-2 h-1/12 mt-4 mb-4">
        <div className="flex items-center gap-8">
          <img
            src={LOGO}
            className="w-[72px] h-[75px] ml-7"
            alt="Logo"
          />

          <div className="flex items-center gap-3 px-5 rounded-md w-[290px] bg-light-blue">
            <Search className="w-5 h-5 text-dark-grey" />
            <input
              type="text"
              className="h-11 bg-transparent placeholder:text-dark-blue outline-0"
              placeholder="Search"
              onChange={(e) => onSearch(e.target.value)}
            />
          </div>
        </div>

        {/* PROFILE SECTION */}
        <div className="relative mr-4" ref={dropdownRef}>
          <button
            onClick={() => setShowDropdown(!showDropdown)}
            className="flex items-center gap-2 text-dark-blue"
          >
            <span className="text-sm">{userName}</span>
            <div className="bg-light-blue w-9 h-9 rounded-full flex items-center justify-center font-medium">
              {userInitials}
            </div>
          </button>

          {/* DROPDOWN */}
          {showDropdown && (
            <div className="absolute right-0 mt-3 w-40 bg-white shadow-lg rounded-md border">
              <button
                onClick={() => {
                  navigate("/dashboard/profile");
                  setShowDropdown(false);
                }}
                className="w-full text-left px-4 py-2.5 hover:bg-light-blue cursor-pointer text-sm"
              >
                Edit Profile
              </button>

              <button
                onClick={() => {
                  setShowDropdown(false);
                  setShowLogoutModal(true);
                }}
                className="w-full text-left px-4 py-2.5 hover:bg-light-blue cursor-pointer text-sm "
              >
                Logout
              </button>
            </div>
          )}
        </div>
      </div>

      {/* LOGOUT CONFIRMATION MODAL */}
      {showLogoutModal && (
        <div className="fixed inset-0 font-roboto-flex flex justify-center items-center backdrop-blur-xs backdrop-grayscale-50  drop-shadow-lg z-20">
          <div className="bg-white rounded-lg w-[400px] h-[190px] pl-8 pr-6 mb-5 pt-8 pb-4 shadow-lg">
            <h2 className="text-lg font-semibold text-black">
              Confirm Logout
            </h2>
            <p className="text-sm mt-2 text-gray-600">
              Are you willing to log out?
            </p>

            <div className="flex justify-end gap-3 mt-6">
              <button
                onClick={() => setShowLogoutModal(false)}
                className="px-4 py-2 border rounded-md text-sm"
              >
                Cancel
              </button>
              <button
                onClick={handleLogout}
                className="px-4 py-2 bg-darkest-blue text-white rounded-md text-sm"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default NavBar;
