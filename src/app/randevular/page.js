"use client";

import React, { useState, useEffect } from "react";
import "./page.css";
import { withAuth } from "../../components/withAuth";
import { supabase } from "../../../lib/supabaseClient";

const Randevu = ({ setIsBanned }) => {
  // setIsBanned'i props olarak al
  const [appointments, setAppointments] = useState([]);
  const [cancelCount, setCancelCount] = useState(0); // İptal sayısı

  // Fetch appointments from Supabase
  const fetchAppointments = async () => {
    const { data, error } = await supabase
      .from("appointments")
      .select(
        "score, category, start_date, end_date, userID, isApproved, appointmentsID"
      )
      .eq("isApproved", true);

    if (error) {
      console.error("Error fetching appointments:", error);
    } else {
      console.log(data); // appointments dizisini kontrol etmek için
      setAppointments(data);
    }
  };

  const cancelAppointment = async (id) => {
    if (!id) {
      console.error("Invalid appointment ID:", id); // ID'nin geçersiz olduğunu kontrol et
      return;
    }

    const { error } = await supabase
      .from("appointments")
      .delete()
      .eq("appointmentsID", id); // appointmentsID kullanın

    if (error) {
      console.error("Error canceling appointment:", error);
    } else {
      const newCancelCount = cancelCount + 1; // İptal sayısını artır
      setCancelCount(newCancelCount); // İptal sayısını güncelle
      fetchAppointments(); // Güncel randevuları tekrar getir

      // İptal sayısı 3'ü geçerse banla
      if (newCancelCount >= 3) {
        setIsBanned(true); // Kullanıcıyı banla
        // 2 hafta (1209600000 ms) sonra banı kaldır
        setTimeout(() => {
          setIsBanned(false);
          setCancelCount(0); // İptal sayısını sıfırla
        }, 1209600000);
      }
    }
  };

  useEffect(() => {
    fetchAppointments();
  }, []);

  return (
    <div className="appointments-containerr">
      <h2>Randevularım</h2>
      <div className="appointments-table">
        <div className="appointments-headerr">
          <div className="appointments-header-itemm">Kategori</div>
          <div className="appointments-header-itemm">Tarih</div>
          <div className="appointments-header-itemm">Alınan Puan</div>
          <div className="appointments-header-itemm">İptal Et</div>{" "}
          {/* İptal Et başlığı */}
        </div>
        {appointments.map((appointment, index) => (
          <div key={index} className="appointments-row">
            <div className="appointments-itemm">{appointment.category}</div>
            <div className="appointments-itemm">
              {new Date(appointment.start_date).toLocaleString()}
            </div>
            <div className="appointments-itemm">
              {new Date(appointment.end_date).toLocaleString()}
            </div>
            <div className="appointments-itemm">{appointment.score}</div>
            <div className="appointments-itemm">
              <button
                className="btn-delete"
                onClick={() => cancelAppointment(appointment.appointmentsID)}
              >
                İptal Et
              </button>{" "}
              {/* appointmentsID kullanın */}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default withAuth(Randevu);
