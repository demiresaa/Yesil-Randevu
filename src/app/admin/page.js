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

  useEffect(() => {
    const fetchAppointments = async () => {
      const { data: appointmentsData, error: appointmentsError } =
        await supabase.from("appointments").select("*");

      if (appointmentsError) {
        console.error("Error fetching appointments:", appointmentsError);
        return;
      }

      const updatedAppointments = await Promise.all(
        appointmentsData.map(async (appointment) => {
          let userScoreData;
          try {
            // Önce mevcut user-score'u kontrol et
            const { data: existingScore, error: fetchError } = await supabase
              .from("user-score")
              .select("*")
              .eq("userID", appointment.userID)
              .maybeSingle();

            if (fetchError) throw fetchError;

            if (existingScore) {
              userScoreData = existingScore;
            } else {
              // Eğer kayıt yoksa yeni bir kayıt oluştur
              const { data: newScore, error: insertError } = await supabase
                .from("user-score")
                .insert({ userID: appointment.userID, total_score: 0 }) // okScore kaldırıldı
                .select()
                .single();

              if (insertError) throw insertError;
              userScoreData = newScore;
            }
          } catch (err) {
            console.error(
              "Error handling user score for userID:",
              appointment.userID,
              err
            );
            // Hata durumunda varsayılan değerler kullan
            userScoreData = {
              score_id: null,
              total_score: 0,
              isScoreApproved: false,
            };
          }

          return {
            ...appointment,
            score_id: userScoreData.score_id,
            total_score: userScoreData.total_score || 0, // okScore kaldırıldı
            isScoreApproved: userScoreData.isScoreApproved || false,
          };
        })
      );

      setAppointments(updatedAppointments);
    };

    fetchAppointments();
    const interval = setInterval(fetchAppointments, 5000);
    return () => clearInterval(interval);
  }, [setAppointments]);

  const handleApprove = async (index) => {
    const appointment = appointments[index];
    if (!appointment["appointments-id"]) {
      console.error(
        "appointments-id is undefined for appointment:",
        appointment
      );
      return;
    }

    const { data, error } = await supabase
      .from("appointments")
      .update({ isApproved: true })
      .eq("appointments-id", appointment["appointments-id"])
      .select();

    if (error) {
      console.error("Error updating appointment in Supabase:", error);
    } else {
      console.log("Appointment updated in Supabase:", data);
      const updatedAppointments = [...appointments];
      updatedAppointments[index] = { ...appointment, isApproved: true };
      setAppointments(updatedAppointments);
    }
  };

  const handleDelete = async (index) => {
    const appointment = appointments[index];
    if (!appointment["appointments-id"]) {
      console.error(
        "appointments-id is undefined for appointment:",
        appointment
      );
      return;
    }

    const { error: deleteError } = await supabase
      .from("appointments")
      .delete()
      .eq("appointments-id", appointment["appointments-id"]);

    if (deleteError) {
      console.error("Error deleting appointment from Supabase:", deleteError);
    } else {
      console.log("Appointment deleted from Supabase");
      const updatedAppointments = appointments.filter((_, i) => i !== index);
      setAppointments(updatedAppointments);
    }
  };

  const handleScoreApprove = async (index) => {
    const appointment = appointments[index];

    if (!appointment.userID) {
      console.error("UserID is undefined for appointment:", appointment);
      return;
    }

    try {
      // Önce mevcut skoru al veya yeni bir kayıt oluştur
      const { data: userScore, error: fetchError } = await supabase
        .from("user-score")
        .select("*")
        .eq("userID", appointment.userID)
        .single();

      if (fetchError) throw fetchError;

      let scoreId, currentTotalScore;

      if (userScore) {
        scoreId = userScore.score_id;
        currentTotalScore = userScore.total_score || 0;
      } else {
        // Eğer kayıt yoksa yeni bir kayıt oluştur
        const { data: newScore, error: insertError } = await supabase
          .from("user-score")
          .insert({ userID: appointment.userID, total_score: 0 }) // okScore kaldırıldı
          .select()
          .single();

        if (insertError) throw insertError;
        scoreId = newScore.score_id;
        currentTotalScore = 0;
      }

      const newTotalScore = currentTotalScore + appointment.score;

      // Skoru güncelle
      const { data, error } = await supabase
        .from("user-score")
        .update({
          total_score: newTotalScore,
          isScoreApproved: true,
        })
        .eq("score_id", scoreId)
        .select();

      if (error) throw error;

      console.log("Scores updated in Supabase:", data);

      // State'i güncelle
      const updatedAppointments = appointments.map((app, i) =>
        i === index
          ? { ...app, total_score: newTotalScore, isScoreApproved: true } // okScore kaldırıldı
          : app
      );
      setAppointments(updatedAppointments);

      // 2 saniye sonra isScoreApproved'ı false yap
      setTimeout(async () => {
        const { error: resetError } = await supabase
          .from("user-score")
          .update({ isScoreApproved: false })
          .eq("score_id", scoreId);

        if (resetError) {
          console.error("Error resetting isScoreApproved:", resetError);
        } else {
          const resetAppointments = appointments.map((app, i) =>
            i === index ? { ...app, isScoreApproved: false } : app
          );
          setAppointments(resetAppointments);
        }
      }, 2000);
    } catch (err) {
      console.error("Error updating scores:", err);
    }
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
          <div className="appointments-header-item">Durum</div>
          <div className="appointments-header-item">Onayla</div>
          <div className="appointments-header-item">Sil</div>
          <div className="appointments-header-item">Kullanıcı ID</div>
          <div className="appointments-header-item">Score Onayla</div>
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
              <div className="appointments-item">{appointment.userID}</div>
              <div className="appointments-item">
                {!appointment.isScoreApproved ? (
                  <button
                    className="btn-score-approve btn-approve"
                    onClick={() => handleScoreApprove(index)}
                  >
                    Score Onayla
                  </button>
                ) : (
                  <span className="approved-icon">✔️</span>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Admin;
