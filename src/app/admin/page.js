"use client";
import React, { useContext, useEffect, useState } from "react";
import { AppointmentContext } from "../../context/AppointmentContext";
import { useAuth } from "../../context/AuthContext";
import { supabase } from "../../../lib/supabaseClient";
import "./page.css";

const Randevu2 = () => {
  const { appointments, setAppointments } = useContext(AppointmentContext);
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      if (user.email !== "demiresa38@gmail.com") {
        window.location.href = "/home2";
      } else {
        setLoading(false);
      }
    } else {
    }
  }, [user]);

  const handleApprove = async (index) => {
    const appointment = appointments[index];
    const { data, error } = await supabase
      .from("appointments")
      .update({ isApproved: true })
      .eq("id", appointment.id)
      .select();

    if (error) {
      console.error("Error updating appointment in Supabase:", error);
    } else {
      console.log("Appointment updated in Supabase:", data);
      // Randevuyu onaylandı olarak güncelle
      const updatedAppointments = [...appointments];
      updatedAppointments[index] = { ...appointment, isApproved: true };
      setAppointments(updatedAppointments);
    }
  };

  const handleDelete = async (index) => {
    const appointment = appointments[index];
    const { error } = await supabase
      .from("appointments")
      .delete()
      .eq("id", appointment.id);

    if (error) {
      console.error("Error deleting appointment from Supabase:", error);
    } else {
      console.log("Appointment deleted from Supabase");
      // Randevuyu context'ten sil
      const updatedAppointments = appointments.filter((_, i) => i !== index);
      setAppointments(updatedAppointments);
    }
  };

  if (loading) {
    return <div>Loading...</div>; // Yüklenme ekranı
  }

  return (
    <div className="appointments-container">
      <h2>Randevularım</h2>
      <div className="appointments-table">
        <div className="appointments-header">
          <div className="appointments-header-item">Kategori</div>
          <div className="appointments-header-item">Başlangıç Tarihi</div>
          <div className="appointments-header-item">Bitiş Tarihi</div>
          <div className="appointments-header-item">Durum</div>
          <div className="appointments-header-item">Onayla</div>
          <div className="appointments-header-item">Sil</div>
        </div>
        {appointments.length === 0 ? (
          <p>Henüz randevu bulunmamaktadır.</p>
        ) : (
          appointments.map((appointment, index) => (
            <div key={index} className="appointments-row">
              <div className="appointments-item">{appointment.category}</div>
              <div className="appointments-item">
                {new Date(appointment.start_date).toLocaleString()}
              </div>
              <div className="appointments-item">
                {new Date(appointment.end_date).toLocaleString()}
              </div>
              <div className="appointments-item">
                {appointment.isApproved ? (
                  <span className="approved-icon">✔️</span>
                ) : (
                  "Beklemede"
                )}
              </div>
              <div className="appointments-item">
                {!appointment.isApproved && (
                  <button onClick={() => handleApprove(index)}>Onayla</button>
                )}
              </div>
              <div className="appointments-item">
                <button onClick={() => handleDelete(index)}>Sil</button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Randevu2;
