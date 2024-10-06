"use client";
import React, { useContext, useEffect, useState } from "react";
import { AppointmentContext } from "../../context/AppointmentContext";
import { useAuth } from "../../context/AuthContext";
import { supabase } from "../../../lib/supabaseClient";
import "./page.css";

const Admin = () => {
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
    }
  }, [user]);

  const fetchAppointments = async () => {
    const { data: appointmentsData, error: appointmentsError } = await supabase
      .from("appointments")
      .select(
        "category, start_date, end_date, score, userID, appointmentsID, isApproved, teslimAlindi" // teslimAlindi alanını ekleyin
      );

    if (appointmentsError) {
      console.error("Error fetching appointments:", appointmentsError);
      return;
    }

    const updatedAppointments = await Promise.all(
      appointmentsData.map(async (appointment) => {
        let userScoreData;
        try {
          // Sadece mevcut user-score'u kontrol et
          const { data: existingScores, error: fetchError } = await supabase
            .from("user-score")
            .select("*")
            .eq("userID", appointment.userID) // userID ile eşleşme
            .eq("appointmentsID", appointment.appointmentsID); // appointmentsID ile eşleşme

          if (fetchError) throw fetchError;

          if (existingScores.length > 0) {
            userScoreData = existingScores[0]; // İlk mevcut skoru al
          } else {
            userScoreData = { scoreID: null }; // Kayıt yoksa varsayılan değer
          }
        } catch (err) {
          console.error(
            "Error handling user score for appointmentsID:",
            appointment.appointmentsID,
            err
          );
          userScoreData = { scoreID: null }; // Hata durumunda varsayılan değerler kullan
        }

        return {
          ...appointment,
          scoreID: userScoreData.scoreID,
        };
      })
    );

    setAppointments(updatedAppointments);
    console.log("Updated appointments:", updatedAppointments); // {{ edit_2 }}
  };

  useEffect(() => {
    fetchAppointments(); // Fetch on mount
    // Removed the interval fetching
    // const interval = setInterval(fetchAppointments, 5000);
    // return () => clearInterval(interval);
  }, [setAppointments]); // {{ edit_1 }}

  const handleApprove = async (index) => {
    const appointment = appointments[index];
    if (!appointment["appointmentsID"]) {
      console.error(
        "appointmentsID is undefined for appointment:",
        appointment
      );
      return;
    }

    // Randevuyu onayla
    const { data: updatedData, error: updateError } = await supabase
      .from("appointments")
      .update({ isApproved: true }) // Onay durumu güncelleniyor
      .eq("appointmentsID", appointment["appointmentsID"])
      .select();

    if (updateError) {
      console.error("Error updating appointment in Supabase:", updateError);
      return;
    }

    console.log("Appointment updated in Supabase:", updatedData);

    // Verileri yeniden yükle
    fetchAppointments(); // Fetch after approving
  };

  const handleDelivery = async (index) => {
    const appointment = appointments[index];
    if (!appointment["appointmentsID"]) {
      console.error(
        "appointmentsID is undefined for appointment:",
        appointment
      );
      return;
    }

    const { data: updatedData, error: updateError } = await supabase
      .from("appointments")
      .update({ teslimAlindi: true }) // Teslim alındı durumu güncelleniyor
      .eq("appointmentsID", appointment["appointmentsID"])
      .select();

    if (updateError) {
      console.error("Error updating appointment in Supabase:", updateError);
      return;
    }

    console.log("Appointment updated in Supabase:", updatedData);

    // Verileri yeniden yükle
    await fetchAppointments(); // Fetch after updating
    console.log("Appointments after delivery fetch:", appointments); // {{ edit_1 }}
  };

  const handleDelete = async (index) => {
    const appointment = appointments[index];
    if (!appointment["appointmentsID"]) {
      console.error(
        "appointmentsID is undefined for appointment:",
        appointment
      );
      return;
    }

    const { error: deleteError } = await supabase
      .from("appointments")
      .delete()
      .eq("appointmentsID", appointment["appointmentsID"]);

    if (deleteError) {
      console.error("Error deleting appointment from Supabase:", deleteError);
    } else {
      console.log("Appointment deleted from Supabase");
      const updatedAppointments = appointments.filter((_, i) => i !== index);
      setAppointments(updatedAppointments);
    }

    fetchAppointments(); // Fetch after deleting
  };

  const handleScoreAdd = async (index) => {
    const appointment = appointments[index];

    // appointmentsID ve userID kontrolü
    if (!appointment.appointmentsID || !appointment.userID) {
      console.error(
        "appointmentsID or userID is undefined for appointment:",
        appointment
      );
      return; // Fonksiyonu sonlandır
    }

    try {
      // Yeni skor kaydını user-score tablosuna ekle
      const scoreData = {
        userID: appointment.userID, // userID kullanılıyor
        appointmentsID: appointment.appointmentsID, // Randevu ID'si
        score: appointment.score, // Randevuya ait score
      };

      const { data: scoreDataResponse, error: scoreInsertError } =
        await supabase.from("user-score").insert([scoreData]); // Her yeni randevu için ayrı skor ekleniyor

      if (scoreInsertError) {
        console.error(
          "Error inserting score data into Supabase:",
          scoreInsertError
        );
      } else {
        console.log("Score data inserted successfully:", scoreDataResponse);

        // user-details tablosundaki totalScore'u güncelle
        const { data: userDetails, error: fetchError } = await supabase
          .from("user-details")
          .select("totalScore")
          .eq("userID", appointment.userID) // userID ile eşleşme
          .single();

        if (fetchError) throw fetchError;

        const newTotalScore = (userDetails.totalScore || 0) + appointment.score;

        const { error: updateError } = await supabase
          .from("user-details")
          .update({ totalScore: newTotalScore })
          .eq("userID", appointment.userID); // userID ile eşleşme

        if (updateError) throw updateError;

        console.log(
          "Total score updated successfully for userID:",
          appointment.userID
        );
      }
    } catch (err) {
      console.error("Error adding score:", err);
    }

    fetchAppointments(); // Fetch after adding score
  };

  const handleScoreRemove = async (index) => {
    const appointment = appointments[index];

    if (!appointment.userID) {
      console.error("UserID is undefined for appointment:", appointment);
      return;
    }

    try {
      const { data: userDetails, error: fetchError } = await supabase
        .from("user-details")
        .select("totalScore")
        .eq("userID", appointment.userID)
        .single();

      if (fetchError) throw fetchError;

      const newTotalScore = (userDetails.totalScore || 0) - appointment.score;

      const { error: updateError } = await supabase
        .from("user-details")
        .update({ totalScore: newTotalScore })
        .eq("userID", appointment.userID);

      if (updateError) throw updateError;

      console.log("Score removed successfully for userID:", appointment.userID);
    } catch (err) {
      console.error("Error removing score:", err);
    }

    fetchAppointments(); // Fetch after removing score
  };

  if (loading) {
    return <div className="yükleniyor">Yükleniyor...</div>;
  }

  return (
    <div className="appointments-container">
      <h2>Randevularım</h2>
      <div className="appointments-table">
        <div className="appointments-header">
          <div className="appointments-header-item">Kategori</div>
          <div className="appointments-header-item">Başlangıç Tarihi</div>
          <div className="appointments-header-item">Bitiş Tarihi</div>
          <div className="appointments-header-item">Onayla</div>
          <div className="appointments-header-item">Sil</div>
          <div className="appointments-header-item">Teslim Alındı</div>
          <div className="appointments-header-item">Kullanıcı ID</div>
          <div className="appointments-header-item">Score İşlemleri</div>
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
                  <button
                    className="btn-approve"
                    onClick={() => handleApprove(index)}
                  >
                    Onayla
                  </button>
                )}
              </div>
              <div className="appointments-item">
                <button
                  className="btn-delete"
                  onClick={() => handleDelete(index)}
                >
                  Sil
                </button>
              </div>
              <div className="appointments-item">
                {appointment.teslimAlindi ? ( // {{ edit_2 }}
                  <span className="approved-icon">✔️</span>
                ) : (
                  <button
                    className="btn-delivery btn-approve"
                    onClick={() => handleDelivery(index)}
                  >
                    Teslim Alındı
                  </button>
                )}
              </div>
              <div className="appointments-item">{appointment.userID}</div>
              <div className="appointments-item">
                <button
                  className="btn-score-add btn-approve"
                  onClick={() => handleScoreAdd(index)}
                >
                  Score Ekle
                </button>
                <button
                  className="btn-score-remove btn-delete"
                  onClick={() => handleScoreRemove(index)}
                >
                  Score Sil
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Admin;
