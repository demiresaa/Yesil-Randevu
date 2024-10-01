"use client";

import React, { useState } from "react";
import "./page.css";
import { withAuth } from "../../components/withAuth";

const Randevu = () => {
  const [appointments] = useState([]);

  return (
    <div className="appointments-container">
      <h2>Randevularım</h2>
      <div className="appointments-table">
        <div className="appointments-header">
          <div className="appointments-header-item">Kategori</div>
          <div className="appointments-header-item">Aldığı Puan</div>
          <div className="appointments-header-item">Tarih</div>
        </div>
        {appointments.map((appointment) => (
          <div key={appointment.id} className="appointments-row">
            <div className="appointments-item">{appointment.category}</div>
            <div className="appointments-item">{appointment.rating}</div>
            <div className="appointments-item">{appointment.date}</div>
          </div>
        ))}
      </div>
    </div>
  );
};
export default withAuth(Randevu);
