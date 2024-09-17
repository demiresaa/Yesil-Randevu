"use client";
/* eslint-disable @next/next/no-img-element */
import React, { useState, useEffect } from "react";
import { supabase } from "../../../lib/supabaseClient";
import "./page.css";
import { withAuth } from "../../components/withAuth";

const defaultProfileImage =
  "https://cdn.pixabay.com/photo/2017/07/18/23/23/user-2517433_1280.png";

const Profile = () => {
  const [userProfile, setUserProfile] = useState({
    fullName: "",
    email: "",
    phone: "",
    dob: "",
    address: "",
    profileImage: defaultProfileImage,
  });

  useEffect(() => {
    const fetchUserProfile = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (user) {
        const { data, error } = await supabase
          .from("user-details")
          .select("*")
          .eq("id", user.id)
          .single();

        if (error) {
          console.error("Error fetching user profile:", error);
        } else if (data) {
          setUserProfile((prevProfile) => ({
            ...prevProfile,
            fullName: data.name || "",
            email: user.email || "",
            phone: data.phoneNumber || "",
            dob: data.birthDate || "",
            address: data.address || "",
            profileImage: data.profileImage || defaultProfileImage,
          }));
        }
      }
    };

    fetchUserProfile();
  }, []);

  return (
    <div className="profile-container">
      <div className="profile-header">
        <img
          src={userProfile.profileImage}
          alt="Profile"
          className="profile-image"
        />
        <h2>Kullanıcı Profili</h2>
      </div>

      <div className="profile-row">
        <div className="profile-category">
          <h3>Ad ve Soyad</h3>
          <p>{userProfile.fullName}</p>
        </div>

        <div className="profile-category">
          <h3>Email</h3>
          <p>{userProfile.email}</p>
        </div>

        <div className="profile-category">
          <h3>Telefon Numarası</h3>
          <p>{userProfile.phone}</p>
        </div>

        <div className="profile-category">
          <h3>Doğum Tarihi</h3>
          <p>{userProfile.dob}</p>
        </div>

        <div className="profile-category">
          <h3>Adreslerim</h3>
          <p>{userProfile.address}</p>
        </div>
      </div>
    </div>
  );
};

export default withAuth(Profile);
