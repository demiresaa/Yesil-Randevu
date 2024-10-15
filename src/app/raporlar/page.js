"use client";

import React, { useState } from "react";
import "./page.css";
import { withAuth } from "../../components/withAuth";
import { supabase } from "../../../lib/supabaseClient";

const Raporlar = () => {
  const [appointments, setAppointments] = useState([]);
  const [filteredAppointments, setFilteredAppointments] = useState([]);
  const [userDetails, setUserDetails] = useState({});
  const [loading, setLoading] = useState(false);
  const [showTable, setShowTable] = useState(false);
  const [showFilteredTable, setShowFilteredTable] = useState(false);

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

    // Kullanıcı detaylarını userID'ye göre eşleştir ve küçük harfe dönüştür
    const userDetailsMap = {};
    userDetailsData.forEach((user) => {
      userDetailsMap[user.userID] = {
        address: user.address.toLowerCase(), // Küçük harfe dönüştür
        phoneNumber: user.phoneNumber.toLowerCase(), // Küçük harfe dönüştür
      };
    });

    // Randevuları küçük harfe dönüştür
    const lowerCaseAppointments = appointmentsData.map((appointment) => ({
      ...appointment,
      category: appointment.category.toLowerCase(), // Küçük harfe dönüştür
      score: appointment.score, // Küçük harfe dönüştür
    }));

    setAppointments(lowerCaseAppointments);
    setUserDetails(userDetailsMap);
    setShowTable(true);
    setLoading(false);
  };

  const fetchFilteredAppointments = async (keyword) => {
    setLoading(true);

    // Kullanıcı detaylarını al
    const { data: userDetailsData, error: userDetailsError } = await supabase
      .from("user-details")
      .select("userID, address, phoneNumber");

    if (userDetailsError) {
      console.error("Error fetching user details:", userDetailsError);
      setLoading(false);
      return;
    }

    // Belirtilen kelimeye sahip kullanıcıları filtrele
    const filteredUserIds = userDetailsData
      .filter(
        (user) =>
          user.address &&
          user.address.toLowerCase().includes(keyword.toLowerCase())
      ) // Küçük harfe dönüştür
      .map((user) => user.userID);

    // Filtrelenmiş kullanıcıların randevularını al
    const { data: filteredData, error: filteredError } = await supabase
      .from("appointments")
      .select("*")
      .in("userID", filteredUserIds);

    if (filteredError) {
      console.error(`Error fetching ${keyword} appointments:`, filteredError);
      setLoading(false);
      return;
    }

    // Kullanıcı detaylarını userID'ye göre eşleştir
    const userDetailsMap = {};
    userDetailsData.forEach((user) => {
      userDetailsMap[user.userID] = {
        address: user.address.toLowerCase(), // Küçük harfe dönüştür
        phoneNumber: user.phoneNumber.toLowerCase(), // Küçük harfe dönüştür
      };
    });

    setFilteredAppointments(filteredData);
    setUserDetails(userDetailsMap); // Kullanıcı detaylarını state'e kaydet
    setShowFilteredTable(true); // Filtrelenmiş tabloyu göster
    setLoading(false);
  };

  const downloadAppointments = () => {
    window.print();
  };

  const downloadFilteredAppointments = () => {
    // Filtrelenmiş randevuları yazdır
    const filteredData = filteredAppointments.map((appointment) => ({
      Kategori: appointment.category,
      Başlangıç: new Date(appointment.start_date).toLocaleString(),
      Bitiş: new Date(appointment.end_date).toLocaleString(),
      Adres: userDetails[appointment.userID]?.address || "Adres bilgisi yok",
      "Telefon No":
        userDetails[appointment.userID]?.phoneNumber || "Telefon bilgisi yok",
    }));

    const csvContent =
      "data:text/csv;charset=utf-8," +
      filteredData.map((e) => Object.values(e).join(",")).join("\n");

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "filtered_appointments.csv");
    document.body.appendChild(link); // Required for FF

    link.click();
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
      <br />
      <br />
      <br />

      {/* Filtreleme Butonları */}
      <button onClick={() => fetchFilteredAppointments("serdivan")}>
        Serdivan Randevuları
      </button>
      <button onClick={() => fetchFilteredAppointments("adapazarı")}>
        Adapazarı Randevuları
      </button>
      <button onClick={() => fetchFilteredAppointments("sapanca")}>
        Sapanca Randevuları
      </button>
      <button onClick={() => fetchFilteredAppointments("erenler")}>
        Erenler Randevuları
      </button>
      <button onClick={() => fetchFilteredAppointments("arifiye")}>
        Arifiye Randevuları
      </button>
      <button onClick={() => fetchFilteredAppointments("korucuk")}>
        Korucuk Randevuları
      </button>

      {showFilteredTable && filteredAppointments.length > 0 && (
        <div>
          <h3>Filtrelenmiş Randevular</h3>
          <button onClick={() => setShowFilteredTable(!showFilteredTable)}>
            {showFilteredTable ? "Tabloyu Kapat" : "Tabloyu Göster"}
          </button>
          {showFilteredTable && (
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
                {filteredAppointments.map((appointment, index) => (
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
          <p>
            Toplam Filtrelenmiş Randevu Sayısı: {filteredAppointments.length}
          </p>
          <button onClick={downloadFilteredAppointments}>
            İndir Filtrelenmiş Randevular
          </button>
        </div>
      )}
    </div>
  );
};

export default withAuth(Raporlar);
