/* eslint-disable @next/next/no-img-element */
import React from "react";
import "./page.css";

const Profile = () => {
  const userProfile = {
    fullName: "kinya skc",
    email: "johndoe@example.com",
    phone: "+90 555 123 4567",
    dob: "01/01/1990",
    address: "1234 Main St, Ankara, Türkiye",
    profileImage:
      "https://cdn.pixabay.com/photo/2017/07/18/23/23/user-2517433_1280.png", // Profil resmi URL'si, burayı gerçek resim URL'si ile değiştirin
  };

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

export default Profile;
