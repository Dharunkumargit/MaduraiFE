import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import axios from "axios";
import { toast } from "react-toastify";
import { API } from "../../../../const";

const schema = yup.object().shape({
  name: yup.string().required("Full name is required"),
  email: yup
    .string()
    .email("Enter a valid email address")
    .required("Email is required"),
  phonenumber: yup
    .string()
    .matches(/^[0-9]{10}$/, "Enter a valid 10-digit phone number")
    .required("Phone number is required"),
});

const Edit_profile = ({ user, onSave }) => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
  });

  useEffect(() => {
    if (user) {
      reset({
        name: user.name || "",
        email: user.emailid || "",
        phonenumber: user.phonenumber || "",
      });
    }
  }, [user, reset]);

  console.log("User data in Edit_profile:", user);
  const onSubmit = async (data) => {
    try {
      // Use the correct endpoint from your router
      await axios.put(`${API}/employee/updateuser/${user.id}`, {
        name: data.name,
        email: data.email,
        phonenumber: data.phonenumber,
        role: user.role // Keep existing role
      });

      toast.success("Profile Updated Successfully!");
      
      // Call parent callback to update state
      if (onSave) {
        onSave(data);
      }
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Failed to update profile"
      );
    }
  };

  return (
    <div className=" ">
      <h3 className="text-lg font-semibold mb-4">Edit Profile</h3>
      <div className="space-y-4">
        <div className="flex flex-col gap-1">
          <p className="font-semibold text-sm">Full Name</p>
          <input
            {...register("name")}
            className="w-96 py-3 px-2 rounded-md bg-light-blue"
          />
          {errors.name && (
            <p className="text-red-500 text-sm">{errors.name.message}</p>
          )}
        </div>

        <div className="flex flex-col gap-1">
          <p className="font-semibold text-sm">Email ID</p>
          <input
            {...register("email")}
            className="w-96 py-3 px-2 rounded-md bg-light-blue"
          />
          {errors.email && (
            <p className="text-red-500 text-sm">{errors.email.message}</p>
          )}
        </div>

        <div className="flex flex-col gap-1">
          <p className="font-semibold text-sm">Phone number</p>
          <input
            {...register("phonenumber")}
            className="w-96 py-3 px-2 rounded-md bg-light-blue"
          />
          {errors.phonenumber && (
            <p className="text-red-500 text-sm">
              {errors.phonenumber.message}
            </p>
          )}
        </div>

        <div className="flex gap-3 mt-4">
          <button
            onClick={handleSubmit(onSubmit)}
            type="button"
            className="bg-darkest-blue text-white px-6 py-2 rounded"
          >
            Save Profile
          </button>
        </div>
      </div>
    </div>
  );
};

export default Edit_profile;