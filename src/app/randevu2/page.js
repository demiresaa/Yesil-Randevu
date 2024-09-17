"use client";
import React, { useState } from "react";
import "./page.css";

const Randevu = () => {
  const [appointments, setAppointments] = useState([
    {
      id: 1,
      category: "Diş Muayenesi",
      rating: 4.5,
      date: "2024-08-15",
      isApproved: false,
    },
    {
      id: 2,
      category: "Göz Muayenesi",
      rating: 4.0,
      date: "2024-08-22",
      isApproved: false,
    },
    {
      id: 3,
      category: "Genel Sağlık Kontrolü",
      rating: 5.0,
      date: "2024-09-10",
      isApproved: false,
    },
    {
      id: 4,
      category: "Diş Muayenesi",
      rating: 4.5,
      date: "2024-08-15",
      isApproved: false,
    },
    {
      id: 5,
      category: "Diş Muayenesi",
      rating: 4.5,
      date: "2024-08-15",
      isApproved: false,
    },
    {
      id: 6,
      category: "Diş Muayenesi",
      rating: 4.5,
      date: "2024-08-15",
      isApproved: false,
    },
    {
      id: 7,
      category: "Diş Muayenesi",
      rating: 4.5,
      date: "2024-08-15",
      isApproved: false,
    },
    {
      id: 8,
      category: "Diş Muayenesi",
      rating: 4.5,
      date: "2024-08-15",
      isApproved: false,
    },
  ]);

  const handleDelete = (id) => {
    setAppointments(
      appointments.filter((appointment) => appointment.id !== id)
    );
  };

  const handleApprove = (id) => {
    setAppointments(
      appointments.map((appointment) =>
        appointment.id === id
          ? { ...appointment, isApproved: true }
          : appointment
      )
    );
  };

  return (
    <div className="appointments-container">
      <h2>Randevularım</h2>
      <div className="appointments-table">
        <div className="appointments-header">
          <div className="appointments-header-item">Kategori</div>
          <div className="appointments-header-item">Aldığı Puan</div>
          <div className="appointments-header-item">Tarih</div>
          <div className="appointments-header-item">Durum</div>
        </div>
        {appointments.map((appointment) => (
          <div key={appointment.id} className="appointments-row">
            <div className="appointments-item">{appointment.category}</div>
            <div className="appointments-item">{appointment.rating}</div>
            <div className="appointments-item">{appointment.date}</div>
            <div className="appointments-item">
              {appointment.isApproved ? (
                <span className="approved-icon">✔️</span>
              ) : (
                <>
                  <button
                    className="btn btn-approve"
                    onClick={() => handleApprove(appointment.id)}
                  >
                    Onayla
                  </button>
                  <button
                    className="btn btn-delete"
                    onClick={() => handleDelete(appointment.id)}
                  >
                    Sil
                  </button>
                </>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Randevu;
