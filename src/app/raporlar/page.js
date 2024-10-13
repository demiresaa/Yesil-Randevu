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

    // Randevuları al
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

    // Kullanıcı detaylarını al
    const userIds = [...new Set(appointmentsData.map((appt) => appt.userID))];
    const { data: userDetailsData, error: userDetailsError } = await supabase
      .from("user-details")
      .select("userID, address, phoneNumber")
      .in("userID", userIds);

    if (userDetailsError) {
      console.error("Error fetching user details:", userDetailsError);
      setLoading(false);
      return;
    }

    // Kullanıcı detaylarını userID'ye göre eşleştir
    const userDetailsMap = {};
    userDetailsData.forEach((user) => {
      userDetailsMap[user.userID] = {
        address: user.address,
        phoneNumber: user.phoneNumber,
      };
    });

    setAppointments(appointmentsData);
    setUserDetails(userDetailsMap);
    setShowTable(true);
    setLoading(false);
  };

  const downloadAppointments = () => {
    window.print();
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
                  <th>Telefon No</th>
                </tr>
              </thead>
              <tbody>
                {appointments.map((appointment, index) => (
                  <tr key={index}>
                    <td>{appointment.category}</td>
                    <td>{new Date(appointment.start_date).toLocaleString()}</td>
                    <td>{new Date(appointment.end_date).toLocaleString()}</td>
                    <td>
                      {userDetails[appointment.userID]?.address ||
                        "Adres bilgisi yok"}
                    </td>
                    <td>
                      {userDetails[appointment.userID]?.phoneNumber ||
                        "Telefon bilgisi yok"}
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
