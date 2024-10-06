"use client";

import React, { useState, useEffect } from "react";
import "./page.css";
import { withAuth } from "../../components/withAuth";
import { supabase } from "../../../lib/supabaseClient";

const Raporlar = () => {
  const [appointments, setAppointments] = useState([]);
  const [userDetails, setUserDetails] = useState({});
  const [loading, setLoading] = useState(false);
  const [showTable, setShowTable] = useState(false);

  const fetchTodayAppointments = async () => {
    setLoading(true);
    const today = new Date();
    const startOfDay = new Date(today.setHours(0, 0, 0, 0));
    const endOfDay = new Date(today.setHours(23, 59, 59, 999));

    // Fetch appointments
    const { data: appointmentsData, error: appointmentsError } = await supabase
      .from("appointments")
      .select("*")
      .gte("start_date", startOfDay.toISOString())
      .lte("end_date", endOfDay.toISOString());

    if (appointmentsError) {
      console.error("Error fetching today's appointments:", appointmentsError);
      setLoading(false);
      return;
    }

    // Fetch user details for each userID found in appointments
    const userIds = [...new Set(appointmentsData.map((appt) => appt.userID))];
    const { data: userDetailsData, error: userDetailsError } = await supabase
      .from("user-details")
      .select("userID, address")
      .in("userID", userIds);

    if (userDetailsError) {
      console.error("Error fetching user details:", userDetailsError);
      setLoading(false);
      return;
    }

    // Map user details by userID for easy lookup
    const userDetailsMap = {};
    userDetailsData.forEach((user) => {
      userDetailsMap[user.userID] = user.address;
    });

    setAppointments(appointmentsData);
    setUserDetails(userDetailsMap); // Store user details in state
    setShowTable(true);
    setLoading(false);
  };

  const downloadAppointments = () => {
    const appointmentsText = appointments
      .map((appointment) => {
        return `Kategori: ${appointment.category}, Başlangıç: ${new Date(
          appointment.start_date
        ).toLocaleString()}, Bitiş: ${new Date(
          appointment.end_date
        ).toLocaleString()}, Puan: ${appointment.score}, Adres: ${
          userDetails[appointment.userID] || "Adres bilgisi yok"
        }`;
      })
      .join("\n\n"); // İki yeni satır karakteri eklenerek boşluk oluşturuldu

    const blob = new Blob([appointmentsText], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "randevular.txt";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  return (
    <div className="report-containerr">
      <h2>Raporlar</h2>
      <button onClick={fetchTodayAppointments} disabled={loading}>
        {loading ? "Yükleniyor..." : "Günlük Randevuları Al"}
      </button>
      {appointments.length > 0 && (
        <div>
          <h3>Bugünün Randevuları</h3>
          <button onClick={() => setShowTable(!showTable)}>
            {showTable ? "Tabloyu Kapat" : "Tabloyu Göster"}
          </button>
          {showTable && (
            <table className="report-table">
              <thead>
                <tr>
                  <th>Kategori</th>
                  <th>Başlangıç</th>
                  <th>Bitiş</th>
                  <th>Adres</th>
                </tr>
              </thead>
              <tbody>
                {appointments.map((appointment, index) => (
                  <tr key={index}>
                    <td>{appointment.category}</td>
                    <td>{new Date(appointment.start_date).toLocaleString()}</td>
                    <td>{new Date(appointment.end_date).toLocaleString()}</td>
                    <td>
                      {userDetails[appointment.userID] || "Adres bilgisi yok"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
          <button onClick={downloadAppointments}>İndir</button>
        </div>
      )}
    </div>
  );
};

export default withAuth(Raporlar);
