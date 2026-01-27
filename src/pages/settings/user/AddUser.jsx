import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { IoClose, IoChevronDown } from "react-icons/io5";
import axios from "axios";
import { toast } from "react-toastify";
import { InputField } from "../../../components/InputField";
import { API } from "../../../../const";

const schema = yup.object().shape({
  name: yup.string().required("Employee is required"),
  zones: yup.array().min(1, "At least 1 zone required"),
  wards: yup.array().min(1, "At least 1 ward required"),
  designation: yup.string().required("Designation is required"),
  phonenumber: yup
    .string()
    .matches(/^[0-9]{10}$/, "Phone Number must be 10 digits")
    .required("Phone number is required"),
  email: yup.string().email("Invalid email").required("Email is required"),
  role: yup.string().required("Role is required"),
});

const MultiSelectField = ({
  label,
  options,
  selected = [],
  onChange,
  placeholder,
  disabled,
  error,
}) => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleOption = (value) => {
    const newSelected = selected.includes(value)
      ? selected.filter((item) => item !== value)
      : [...selected, value];
    onChange(newSelected);
  };

  return (
    <div className="relative">
      <label className="block text-sm font-medium  mb-1.5">
        {label}
      </label>
      <div
        className={`border-2 border-light-blue rounded-lg p-3 pr-8 cursor-pointer  focus-within:border-blue-400 focus-within:ring-2 focus-within:ring-blue-100 bg-white transition-all duration-200 ${
          error ? "border-red-300 bg-red-50" : ""
        } ${disabled ? "bg-gray-50 cursor-not-allowed opacity-60" : ""}
        `}
        onClick={() => !disabled && setIsOpen(!isOpen)}
      >
        <div className="flex items-center justify-between">
          <div className="flex-1 min-w-0">
            {selected.length === 0 ? (
              <span className=" text-sm">{placeholder}</span>
            ) : (
              <div className="flex flex-wrap gap-1 max-w-full">
                {selected.slice(0, 2).map((item) => (
                  <span
                    key={item}
                    className="inline-flex text-xs bg-blue-100  px-2 py-0.5 rounded-full"
                  >
                    {item}
                  </span>
                ))}
                {selected.length > 2 && (
                  <span className="text-xs text-gray-500 ml-1">
                    +{selected.length - 2}
                  </span>
                )}
              </div>
            )}
          </div>
          <IoChevronDown
            className={`w-4 h-4 text-gray-400 ml-2 transition-transform ${isOpen ? "rotate-180" : ""}`}
          />
        </div>
      </div>

      {isOpen && (
        <div className="absolute z-30 w-full mt-2 bg-white border border-gray-200  shadow-lg max-h-40 ">
          {options.length === 0 ? (
            <div className="px-4 py-4 text-center text-gray-500 text-sm">
              No options available
            </div>
          ) : (
            options.map((option) => (
              <div
                key={option.value}
                className={`px-4 py-2.5 cursor-pointer hover:bg-gray-50 flex items-center gap-3 border-b border-gray-50 last:border-b-0 transition-colors ${
                  selected.includes(option.value)
                    ? "bg-blue-50 font-semibold"
                    : ""
                }`}
                onClick={() => toggleOption(option.value)}
              >
                <input
                  type="checkbox"
                  checked={selected.includes(option.value)}
                  onChange={() => {}}
                  className="w-4 h-4 text-black border-gray-300 rounded "
                />
                <span className="text-sm">{option.label}</span>
              </div>
            ))
          )}
        </div>
      )}

      {error && <p className="mt-1 text-xs text-red-600">{error}</p>}
    </div>
  );
};

const AddUser = ({ onclose }) => {
  // ✅ No id prop - gets from employee dropdown
  const [roles, setRoles] = useState([]);
  const [zone, setZone] = useState([]);
  const [ward, setWard] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedEmployeeId, setSelectedEmployeeId] = useState(""); // ✅ This = update target ID

  const {
    register,
    handleSubmit,
    reset,
    watch,
    setValue,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      name: "",
      zones: [],
      wards: [],
    },
  });

  const zonesValue = watch("zones") || [];
  const wardsValue = watch("wards") || [];
  const filteredWards = ward.filter((w) => zonesValue.includes(w.zonename));

  // ✅ CAPTURE EMPLOYEE ID FROM DROPDOWN
  const handleEmployeeChange = (employeeId) => {
    setSelectedEmployeeId(employeeId); // ✅ This becomes UPDATE target
    setValue("name", employeeId);

    const emp = employees.find((e) => e._id === employeeId);
    if (emp) {
      setValue("email", emp.emailid || "");
      setValue("phonenumber", emp.phonenumber || "");
      setValue("designation", emp.designation || "");
    }
  };

  useEffect(() => {
    const loadData = async () => {
      try {
        const [rolesRes, zonesRes, wardsRes, employeesRes] = await Promise.all([
          axios.get(`${API}/roles/getroles`),
          axios.get(`${API}/zone/getzones`),
          axios.get(`${API}/ward/getwards`),
          axios.get(`${API}/employee/getemployees`),
        ]);
        setRoles(rolesRes.data.data || []);
        setZone(zonesRes.data.data || []);
        setWard(wardsRes.data.data || []);
        setEmployees(employeesRes.data.data || []);
      } catch (error) {
        toast.error("Failed to load data");
      }
    };
    loadData();
  }, []);

  const handleZonesChange = (newZones) => {
    setValue("zones", newZones);
    if (newZones.length === 0) {
      setValue("wards", []);
    }
  };

  const handleWardsChange = (newWards) => {
    setValue("wards", newWards);
  };

  const onSubmit = async (data) => {
    setLoading(true);

    if (!selectedEmployeeId) {
      toast.error("Please select an employee first");
      setLoading(false);
      return;
    }

    // ✅ Find selected role details
    const selectedRole = roles.find((role) => role.role_name === data.role);

    const payload = {
      // ✅ Backend expects these fields
      zone: data.zones.join(","),
      ward: data.wards.join(","),

      // ✅ BOTH role_name AND role_id
      role_name: data.role, // "Admin"
      role_id: selectedRole?.role_id || data.role, // "64f...abc" or fallback

      // ✅ Optional: Employee details (if backend needs)
      employeeId: selectedEmployeeId,
    };

    console.log("🚀 Sending payload:", payload);

    try {
      await axios.put(
        `${API}/employee/updateemployee/${selectedEmployeeId}`,
        payload,
        {
          headers: {
            "Content-Type": "application/json",
          },
        },
      );
      onclose();
      toast.success("User Updated Successfully!");
      reset();
      setSelectedEmployeeId("");
    } catch (error) {
      console.error("❌ Error:", error.response?.data);
      toast.error(error.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="font-roboto-flex fixed inset-0 grid justify-center items-center backdrop-blur-xs backdrop-grayscale-50 drop-shadow-lg z-20">
      <div className="shadow-lg py-2 bg-white rounded-md">
        <div className="grid">
          <button
            onClick={onclose}
            className="place-self-end cursor-pointer bg-white rounded-full lg:-mx-4 md:-mx-4 -mx-2 lg:-my- md:-my-5 -my-3 lg:shadow-md md:shadow-md shadow-none lg:py-2.5 md:py-2.5 py-1 lg:px-2.5 md:px-2.5 px-1"
          >
            <IoClose className="size-[24px]" />
          </button>

          <h1 className="text-center font-medium text-2xl py-2">Add User</h1>

          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="px-7 py-6 ">
              <div className="lg:space-y-4 space-y-3.5">
                {/* ✅ Employee dropdown - ID captured here */}
                <div>
                  <label className="block text-sm font-medium  mb-1.5">
                    Name 
                  </label>
                  <select
                    {...register("name")}
                    className="w-full border-2 border-gray-200 rounded-lg p-3 pr-8   transition-all"
                    onChange={(e) => handleEmployeeChange(e.target.value)}
                  >
                    <option value="">Select Employee</option>
                    {employees.map((emp) => (
                      <option key={emp._id} value={emp._id}>
                        {emp.name}
                      </option>
                    ))}
                  </select>
                  {errors.name && (
                    <p className="mt-1 text-xs text-red-600">
                      {errors.name.message}
                    </p>
                  )}
                </div>

                <InputField
                  label="Phone Number"
                  name="phonenumber"
                  placeholder="Type Here"
                  register={register}
                  errors={errors}
                  readOnly
                />

                <InputField
                  label="Email"
                  name="email"
                  placeholder="Type Here"
                  register={register}
                  errors={errors}
                  readOnly
                />

                <InputField
                  label="Designation"
                  name="designation"
                  placeholder="Type Here"
                  register={register}
                  errors={errors}
                  readOnly
                />

                <InputField
                  label="Role "
                  name="role"
                  type="select"
                  placeholder="Select Role"
                  register={register}
                  errors={errors}
                  options={roles.map((role) => ({
                    value: role.role_name,
                    label: role.role_name,
                  }))}
                />

                <MultiSelectField
                  label="Zone "
                  options={zone.map((z) => ({
                    value: z.zonename,
                    label: z.zonename,
                  }))}
                  selected={zonesValue}
                  onChange={handleZonesChange}
                  placeholder="Select Zones "
                  error={errors.zones?.message}
                />

                <MultiSelectField
                  label="Ward "
                  options={filteredWards.map((w) => ({
                    value: w.wardname,
                    label: w.wardname,
                  }))}
                  selected={wardsValue}
                  onChange={handleWardsChange}
                  placeholder={
                    zonesValue.length
                      ? "Select Wards (click to open)"
                      : "Select Zones First"
                  }
                  disabled={!zonesValue.length}
                  error={errors.wards?.message}
                />

                
              </div>
            </div>

           <div className="mx-7 text-xs flex lg:justify-end md:justify-center justify-center gap-2 mb-4">
              <button
                type="button"
                onClick={onclose}
                className="cursor-pointer border border-light-grey text-light-grey px-6 py-2 rounded"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="cursor-pointer px-6 bg-darkest-blue text-white py-2 rounded"
              >
                Save
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AddUser;
