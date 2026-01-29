import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { IoClose } from "react-icons/io5";
import axios from "axios";
import { toast } from "react-toastify";
import { API } from "../../../const";

const schema = yup.object().shape({
  zone: yup
    .string()
    // .oneOf(["Zone A", "Zone B"], "Invalid Zone")
    .required("Zone is required"),
  ward: yup
    .string()
    // .oneOf(["Ward 1", "Ward 2"], "Invalid Ward")
    .required("Ward is required"),
  street: yup.string().required("Street Name is required"),
  latitude: yup.string().required("latitude is required"),

  bintype: yup.string().required("Bin Type is required"),
  capacity: yup.string().required("Capacity is required"),
  
  longitude: yup
    .string()

    .required("Longitude is required"),
});

const InputField = ({
  label,
  name,
  register,
  errors,
  placeholder,
  type = "text",
  options = [],
  disabled=false
}) => (
  <div className="grid grid-cols-8 items-center gap-4">
    <label className="col-span-3 text-sm font-medium">{label}</label>
    {type === "select" ? (
      <select
        defaultValue=""
        disabled={disabled}
        {...register(name)}
        className={`col-span-5 border border-input-bordergrey rounded-lg outline-none py-3 pl-2 text-xs font-light ${
          errors[name] ? "border-red-500" : ""
        }`}
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
    ) : type === "file" ? (
      <input
        type="file"
        accept="image/jpeg, image/jpg, image/png"
        {...register(name)}
        className={`col-span-5 border border-input-bordergrey rounded-lg outline-none py-2 px-2 ${
          errors[name] ? "border-red-500" : ""
        }`}
      />
    ) : (
      <input
        type={type}
        disabled={disabled}
        placeholder={placeholder}
        {...register(name)}
        className={`col-span-5 border border-input-bordergrey rounded-lg outline-none py-2 px-2 placeholder:text-xs placeholder:font-light ${
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

const AddNewBin = ({ onclose,  }) => {
  const [zone,setZone] = useState([]);
  const [ward,setWard] = useState([]);
  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
  });

  const selectedZone = watch("zone");

  const filteredWards = ward.filter(
    (wards) => wards.zonename === selectedZone
  );


  useEffect(() => {
    axios.get(`${API}/ward/getwards`).then((res) => {
      setWard(res.data.data || []);
    });
  }, []);

  useEffect(() => {
    axios.get(`${API}/zone/getzones`).then((res) => {
      setZone(res.data.data || []);
    });
  }, []);

  useEffect(() => {
    reset((prev) => ({ ...prev, ward: "" }));
  }, [selectedZone]);

  const onSubmit = async (data) => {
    try {
     const res = await axios.post(`${API}/bins/createbin`, data); 
     console.log( "bin created",res.data);
     
      toast.success("Bin created successfully");
      reset();
      onclose();
    } catch (err) {
      console.error(err);
      toast.error("Failed to create bin");
    }
  };
  return (
    <div className="font-roboto-flex fixed inset-0 grid justify-center items-center backdrop-blur-xs backdrop-grayscale-50  drop-shadow-lg z-20">
      <div className="mx-2 shadow-lg py-2  bg-white  rounded-md lg:w-[900px] md:w-[500px] w-96">
        <div className="grid">
          <button
            onClick={onclose}
            className=" place-self-end   cursor-pointer bg-white  rounded-full lg:-mx-4 md:-mx-4 -mx-2 lg:-my-6 md:-my-5  -my-3 lg:shadow-md md:shadow-md shadow-none lg:py-2.5 md:py-2.5 py-0 lg:px-2.5 md:px-2.5 px-0 "
          >
            <IoClose className="size-[24px]" />
          </button>
          <h1 className="text-center font-medium text-2xl py-2">Add New Location</h1>
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="grid lg:grid-cols-2 md:grid-cols-1 gap-7 px-6 py-6">
              <div className="space-y-4">
                <InputField
                  label="Zone"
                  name="zone"
                  register={register}
                  errors={errors}
                  placeholder="Type Here"
                  type="select"
                  options={zone.map((zone) => ({
                    value: zone.zonename,
                    label: zone.zonename,
                  }))}
                />

                <InputField
                  label="Ward"
                  name="ward"
                  register={register}
                  errors={errors}
                  disabled={!selectedZone}
                  type="select"
                  placeholder={
                    selectedZone ? "Select Ward" : "Select Zone First"
                  }
                  options={filteredWards.map((w) => ({
                    value: w.wardname,
                    label: w.wardname,
                  }))}
                />
                <InputField
                  label="Street"
                  name="street"
                  register={register}
                  errors={errors}
                  placeholder="Type Here"
                />
                <InputField
                  label="Latitude"
                  name="latitude"
                  register={register}
                  errors={errors}
                  placeholder="Enter gst.no"
                />
              </div>
              <div className="space-y-4">
                <InputField
                  label="Bin Type"
                  name="bintype"
                  register={register}
                  errors={errors}
                  placeholder="Select Here"
                  type="select"
                  options={[
                    { value: "Commercial", label: "Commercial" },
                     { value: "Residential", label: "Residential" },
                     { value: "Industrial", label: "Industrial" },
                     { value: "Garbage", label: "Garbage" },
                    ]}
                />
                <InputField
                  label="Capacity(liters)"
                  name="capacity"
                  register={register}
                  errors={errors}
                  placeholder="Type Here"
                  
                 
                />
                
                <InputField
                  label="Longitude"
                  name="longitude"
                  register={register}
                  errors={errors}
                  placeholder="Type Here"
                />
              </div>
            </div>
            <div className="mx-5 text-xs flex lg:justify-end md:justify-center justify-center gap-2 mb-4">
              <button
                type="button"
                onClick={onclose}
                className="cursor-pointer  border  border-darkest-blue  text-darkest-blue px-6 py-2   rounded"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="cursor-pointer px-6 bg-darkest-blue text-white  rounded"
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

export default AddNewBin;
