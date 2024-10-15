"use client";

import React, { useState, useEffect } from "react";
import "./page.css";
import { withAuth } from "../../components/withAuth";
import { supabase } from "../../../lib/supabaseClient";

const Randevu = () => {
  const [appointments, setAppointments] = useState([]);
  const [cancelCount, setCancelCount] = useState(0);
  const [isBanned, setIsBanned] = useState(false);

  const fetchAppointments = async () => {
    // Get the current session
    const {
      data: { session },
      error: sessionError,
    } = await supabase.auth.getSession();

    if (sessionError) {
      console.error("Error fetching session:", sessionError);
      return;
    }

    const userID = session?.user?.id;

    if (!userID) {
      console.error("User not found or not logged in");
      return;
    }

    const { data, error } = await supabase
      .from("appointments")
      .select(
        "score, category, start_date, end_date, userID, isApproved, appointmentsID"
      )
      .eq("userID", userID) // Filter by the current user's userID
      .eq("isApproved", true);

    if (error) {
      console.error("Error fetching appointments:", error);
    } else {
      setAppointments(data);
    }
  };

  const cancelAppointment = async (id) => {
    if (!id) {
      console.error("Invalid appointment ID:", id);
      return;
    }

    const { error } = await supabase
      .from("appointments")
      .delete()
      .eq("appointmentsID", id);

    if (error) {
      console.error("Error canceling appointment:", error);
    } else {
      const newCancelCount = cancelCount + 1;
      setCancelCount(newCancelCount);
      fetchAppointments();

      if (newCancelCount >= 3) {
        setIsBanned(true);
        setTimeout(() => {
          setIsBanned(false);
          setCancelCount(0);
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
          <div className="appointments-header-itemm">İptal Et</div>
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
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default withAuth(Randevu);
