import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import Title from "../../../components/Title";
import { IoSave, IoChevronDown } from "react-icons/io5";
import { useEffect, useState } from "react";
import axios from "axios";
import { API } from "../../../../const";
import { toast } from "react-toastify";
import { useLocation, useNavigate } from "react-router";

const Editschema = yup.object().shape({
  name: yup.string().required("Name is required"),
  emailid: yup.string().email("Invalid email").required("Email is required"),
  phonenumber: yup
    .string()
    .matches(/^[0-9]{10}$/, "Phone Number must be 10 digits")
    .required("PhoneNumber is required"),
  role_name: yup.string().required("Role is required"),
  zone: yup.array().min(1, "At least 1 zone required"),
  ward: yup.array().min(1, "At least 1 ward required"),
});

const Changeschema = yup.object().shape({
  newPassword: yup
    .string()
    .required("New password is required")
    .min(9, "Password must be at least 9 characters")
    .matches(/[A-Z]/, "Must contain at least one uppercase letter")
    .matches(/[a-z]/, "Must contain at least one lowercase letter")
    .matches(/[0-9]/, "Must contain at least one number")
    .matches(/[^A-Za-z0-9]/, "Must contain at least one special character"),
  confirmPassword: yup
    .string()
    .required("Confirm password is required")
    .oneOf([yup.ref("newPassword")], "Passwords must match"),
});

// ✅ FIXED MULTISELECT - Add/Remove Works Perfectly!
const MultiSelectField = ({ 
  label, 
  options, 
  control,
  name,
  error,
  disabled = false 
}) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <Controller
      control={control}
      name={name}
      render={({ field: { onChange, value = [] } }) => {
        const toggleOption = (optionValue) => {
          const newValue = value.includes(optionValue)
            ? value.filter(item => item !== optionValue)  // ✅ REMOVE
            : [...value, optionValue];                   // ✅ ADD
          onChange(newValue);
        };

        return (
          <div className="grid grid-cols-8 items-center gap-4">
            <label className="sm:col-span-3 col-span-8 text-sm font-medium">{label} *</label>
            <div className="relative col-span-5">
              {/* ✅ CLICKABLE TAG DISPLAY */}
              <div 
                className={`border rounded-lg p-3 pr-8 cursor-pointer hover:border-gray-400 bg-white transition-all w-full ${
                  error ? 'border-red-500 ring-1 ring-red-200' : 'border-input-bordergrey'
                } ${disabled ? 'bg-gray-50 cursor-not-allowed opacity-60' : ''}
                `}
                onClick={() => !disabled && setIsOpen(!isOpen)}
              >
                <div className="flex items-center justify-between">
                  <div className="flex-1 min-w-0">
                    {value.length === 0 ? (
                      <span className="text-gray-500 text-xs">Select {label}</span>
                    ) : (
                      <div className="flex flex-wrap gap-1 max-w-full">
                        {value.slice(0, 2).map(item => (
                          <span key={item} className="text-xs bg-blue-100 text-blue-800 px-2 py-0.5 rounded-full flex items-center gap-1">
                            {item}
                            {/* ✅ REMOVE X BUTTON */}
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                toggleOption(item);
                              }}
                              className="text-blue-600 hover:text-red-500 text-xs font-bold w-4 h-4 flex items-center justify-center rounded-full hover:bg-red-100 transition-all ml-1"
                              title="Remove"
                            >
                              ×
                            </button>
                          </span>
                        ))}
                        {value.length > 2 && (
                          <span className="text-xs text-gray-500 ml-1">+{value.length-2}</span>
                        )}
                      </div>
                    )}
                  </div>
                  <IoChevronDown className={`w-4 h-4 text-gray-400 ml-2 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
                </div>
              </div>

              {/* ✅ DROPDOWN */}
              {isOpen && (
                <div className="absolute z-40 w-full mt-2 bg-white border border-gray-200 rounded-lg shadow-xl max-h-48 overflow-y-auto">
                  {options.map(option => (
                    <div
                      key={option.value}
                      className={`px-4 py-3 cursor-pointer flex items-center gap-3 border-b border-gray-50 last:border-b-0 hover:bg-gray-50 transition-all ${
                        value.includes(option.value) 
                          ? 'bg-blue-50 border-r-4 border-blue-400 font-semibold' 
                          : ''
                      }`}
                      onClick={() => toggleOption(option.value)}
                    >
                      <input
                        type="checkbox"
                        checked={value.includes(option.value)}
                        onChange={() => {}}
                        className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                      />
                      <span className="text-sm">{option.label}</span>
                    </div>
                  ))}
                </div>
              )}

              {/* ✅ ERROR */}
              {error && (
                <p className="text-red-500 text-xs mt-1 col-span-8 text-end -mb-2">
                  {error.message}
                </p>
              )}
            </div>
          </div>
        );
      }}
    />
  );
};

const ChangeInputField = ({ label, name, register, errors, type = "text" }) => (
  <div className="grid grid-cols-8 items-center gap-4">
    <label className="col-span-3 text-sm font-medium">{label}</label>
    <input
      type={type}
      autoComplete="off"
      placeholder="Type Here"
      {...register(name)}
      className={`col-span-5 border border-input-bordergrey rounded-lg outline-none py-3 px-3 w-full placeholder:text-xs placeholder:font-light placeholder-black ${
        errors[name] ? "border-red-500" : ""
      }`}
    />
    {errors[name] && (
      <p className="text-red-500 text-xs col-span-8 text-end">
        {errors[name].message}
      </p>
    )}
  </div>
);

const InputField = ({
  label,
  name,
  register,
  errors,
  placeholder,
  type = "text",
  options = [],
}) => (
  <div className="grid grid-cols-8 items-center gap-4">
    <label className="sm:col-span-3 col-span-8 text-sm font-medium">
      {label}
    </label>
    {type === "select" ? (
      <select
        defaultValue=""
        {...register(name)}
        className={`col-span-5 border border-input-bordergrey rounded-lg outline-none py-4 pl-2 text-xs font-light 
          ${errors[name] ? "border-red-500" : ""}`}
      >
        <option value="" disabled>
          {placeholder}
        </option>
        {options?.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    ) : (
      <input
        type={type}
        placeholder={placeholder}
        {...register(name)}
        className={`sm:col-span-5 col-span-8 w-full border border-input-bordergrey rounded-lg outline-none py-3 px-3 placeholder:text-start placeholder:text-xs placeholder:font-light placeholder-black ${
          errors[name] ? "border-red-500" : ""
        }`}
      />
    )}
    {errors[name] && (
      <p className="text-red-500 text-xs col-span-8 text-end">
        {errors[name].message}
      </p>
    )}
  </div>
);

const EditUser = ({ onclose }) => {
  const [roles, setRoles] = useState([]);
  const [zones, setZones] = useState([]);
  const [wards, setWards] = useState([]);
  const [loading, setLoading] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const item = location.state?.item;

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
    reset,
    setValue,
  } = useForm({
    resolver: yupResolver(Editschema),
  });

  const {
    register: registerPassword,
    handleSubmit: handleSubmitPassword,
    formState: { errors: errorsPassword },
    reset: resetPassword,
  } = useForm({
    resolver: yupResolver(Changeschema),
  });

  // ✅ Load dropdown data
  useEffect(() => {
    const loadData = async () => {
      try {
        const [rolesRes, zonesRes, wardsRes] = await Promise.all([
          axios.get(`${API}/roles/getroles`),
          axios.get(`${API}/zone/getzones`),
          axios.get(`${API}/ward/getwards`),
        ]);
        setRoles(rolesRes.data.data || []);
        setZones(zonesRes.data.data || []);
        setWards(wardsRes.data.data || []);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    loadData();
  }, []);

  // ✅ Populate form with existing data
  useEffect(() => {
    if (item) {
      // ✅ Convert backend strings/arrays to arrays
      const zoneArray = Array.isArray(item.zone) 
        ? item.zone 
        : item.zone ? item.zone.split(',') : [];
      const wardArray = Array.isArray(item.ward) 
        ? item.ward 
        : item.ward ? item.ward.split(',') : [];
      
      setValue("name", item.name || "");
      setValue("emailid", item.emailid || item.email || "");
      setValue("phonenumber", item.phonenumber || "");
      setValue("role_name", item.role_name || item.role || "");
      setValue("zone", zoneArray);
      setValue("ward", wardArray);
    }
  }, [item, setValue]);

const onSubmit = async (data) => {
  setLoading(true);
  try {
    // ✅ FIX: Get role_id from dropdown value
    const selectedRole = roles.find(role => role.role_name === data.role_name);
    
    const payload = {
      name: data.name,
      emailid: data.emailid,
      phonenumber: data.phonenumber,
      role_name: data.role_name,
      role_id: selectedRole?.role_id,  // ✅ ADD THIS
      zone: data.zone.join(','),
      ward: data.ward.join(','),
    };

    console.log("🆔 Employee ID:", item._id);
    console.log("📦 Full Payload:", JSON.stringify(payload, null, 2));

    const response = await axios.put(`${API}/employee/updateemployee/${item._id}`, payload);
    
    console.log("✅ SUCCESS:", response.data);
    toast.success("✅ Employee updated successfully");
    navigate("/settings/users");
    
  } catch (error) {
    console.error("🔥 FULL ERROR:", error.response?.data || error.message);
    toast.error(error.response?.data?.message || "Update failed");
  } finally {
    setLoading(false);
  }
};


  // ✅ SUBMIT - Change Password
  const onSubmitPassword = async (data) => {
    setLoading(true);
    try {
      await axios.put(`${API}/employee/changepassword/${item._id}`, {
        newPassword: data.newPassword,
      });
      toast.success("✅ Password updated successfully");
      resetPassword();
    } catch (error) {
      console.error("❌ Password Error:", error.response?.data);
      toast.error("Password update failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="h-screen">
      <Title title="Settings" sub_title="Employee" page_title="Edit Employee" />
      <div className="grid grid-cols-12 gap-2 my-4 mr-4">
        
        {/* ✅ EDIT FORM */}
        <div className="sm:col-span-6 col-span-12 w-full py-9 rounded-lg bg-white shadow-lg">
          <p className="w-full text-2xl font-semibold flex justify-center items-center">
            Edit Employee Profile
          </p>
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="grid grid-c gap-4 px-6 py-6">
              <div className="space-y-4">
                <InputField
                  label="Name *"
                  name="name"
                  placeholder="Type Here"
                  register={register}
                  errors={errors}
                />
                <InputField
                  label="Email *"
                  name="emailid"
                  placeholder="example@domain.com"
                  register={register}
                  errors={errors}
                />
                <InputField
                  label="Phone Number *"
                  name="phonenumber"
                  placeholder="9876543210"
                  register={register}
                  errors={errors}
                />
                
                {/* ✅ ZONE MULTISELECT */}
                <MultiSelectField
                  label="Zone"
                  options={zones.map((z) => ({
                    value: z.zonename,
                    label: z.zonename,
                  }))}
                  control={control}
                  name="zone"
                  error={errors.zone}
                />

                {/* ✅ WARD MULTISELECT */}
                <MultiSelectField
                  label="Ward"
                  options={wards.map((w) => ({
                    value: w.wardname,
                    label: w.wardname,
                  }))}
                  control={control}
                  name="ward"
                  error={errors.ward}
                />

                <InputField
                  label="Role *"
                  name="role_name"
                  register={register}
                  errors={errors}
                  placeholder="Select Role"
                  type="select"
                  options={roles.map((r) => ({
                    value: r.role_name,
                    label: r.role_name,
                  }))}
                />
              </div>
            </div>
            <div className="mx-5 text-xs flex justify-end gap-2 mb-4">
              <button
                type="submit"
                disabled={loading}
                className="flex gap-2 text-base items-center p-3 cursor-pointer px-6 bg-darkest-blue text-white rounded disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <IoSave size={23} />
                {loading ? "Saving..." : "Update Profile"}
              </button>
            </div>
          </form>
        </div>

        {/* ✅ PASSWORD FORM */}
        <div className="sm:col-span-6 col-span-12 w-full py-5 rounded-lg bg-white shadow-lg">
          <p className="w-full text-2xl font-semibold flex justify-center items-center">
            Change Password
          </p>
          <div className="px-6 py-6">
            <form onSubmit={handleSubmitPassword(onSubmitPassword)} className="space-y-4">
              <ChangeInputField
                label="New Password *"
                name="newPassword"
                register={registerPassword}
                errors={errorsPassword}
                type="password"
              />
              <ChangeInputField
                label="Confirm Password *"
                name="confirmPassword"
                register={registerPassword}
                errors={errorsPassword}
                type="password"
              />
              <p className="text-xs text-gray-700">
                Password must have: 1 capital, 1 small letter, 1 number, 1 special character, minimum 9 characters.
              </p>
              <div className="flex justify-end mt-4">
                <button
                  type="submit"
                  disabled={loading}
                  className="flex items-center gap-2 px-6 py-2 bg-darkest-blue text-white rounded disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <IoSave size={20} />
                  {loading ? "Updating..." : "Update Password"}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditUser;
