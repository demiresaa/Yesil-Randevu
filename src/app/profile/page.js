/* eslint-disable @next/next/no-img-element */
"use client";
import React, { useState, useEffect } from "react";
import { supabase } from "../../../lib/supabaseClient";
import { withAuth } from "../../components/withAuth";
import styles from "./Profile.module.css";
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
          setUserProfile({
            fullName: data.name || "",
            email: user.email || "",
            phone: data.phoneNumber || "",
            dob: data.birthDate || "",
            address: data.address || "",
            profileImage: data.profileImage || defaultProfileImage,
          });
        }
      }
    };

    fetchUserProfile();
  }, []);

  const ProfileCategory = ({ title, value }) => (
    <div className={styles.profileCategory}>
      <h3>{title}</h3>
      <p>{value}</p>
    </div>
  );

  return (
    <div className={styles.profileContainer}>
      <div className={styles.profileHeader}>
        <img
          src={userProfile.profileImage}
          alt="Profile"
          className={styles.profileImage}
        />
        <h2>Kullanıcı Profili</h2>
      </div>

      <div className={styles.profileRow}>
        <ProfileCategory title="Ad ve Soyad" value={userProfile.fullName} />
        <ProfileCategory title="Email" value={userProfile.email} />
        <ProfileCategory title="Telefon Numarası" value={userProfile.phone} />
        <ProfileCategory title="Doğum Tarihi" value={userProfile.dob} />
        <ProfileCategory title="Adreslerim" value={userProfile.address} />
      </div>
    </div>
  );
};

export default withAuth(Profile);
