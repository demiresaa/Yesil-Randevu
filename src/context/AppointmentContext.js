import React, { createContext, useState, useEffect } from "react";
import { supabase } from "../../lib/supabaseClient";

export const AppointmentContext = createContext();

export const AppointmentProvider = ({ children }) => {
  const [appointments, setAppointments] = useState([]);

  useEffect(() => {
    // Sayfa yüklendiğinde localStorage'dan ve Supabase'den randevuları al
    const fetchAppointments = async () => {
      // localStorage'dan randevuları al
      const savedAppointments = localStorage.getItem("appointments");
      const localAppointments = savedAppointments
        ? JSON.parse(savedAppointments)
        : [];

      // Supabase'den randevuları al
      const { data: supabaseAppointments, error } = await supabase
        .from("appointments")
        .select("*");

      if (error) {
        console.error("Error fetching appointments from Supabase:", error);
      } else {
        // localStorage ve Supabase'den gelen randevuları birleştir
        const mergedAppointments = [
          ...localAppointments,
          ...supabaseAppointments,
        ];
        // Tekrar eden randevuları filtrele (id'ye göre)
        const uniqueAppointments = mergedAppointments.filter(
          (appointment, index, self) =>
            index === self.findIndex((t) => t.id === appointment.id)
        );
        setAppointments(uniqueAppointments);
      }
    };

    fetchAppointments();
  }, []);

  useEffect(() => {
    // Randevular değiştiğinde localStorage'a kaydet
    localStorage.setItem("appointments", JSON.stringify(appointments));
  }, [appointments]);

  const addAppointment = async (appointment) => {
    try {
      const { data, error } = await supabase
        .from("appointments")
        .insert([appointment])
        .select();

      if (error) {
        console.error("Error adding appointment to Supabase:", error);
      } else {
        console.log("Appointment added successfully:", data);
        setAppointments((prevAppointments) => [...prevAppointments, data[0]]);
      }
    } catch (error) {
      console.error("Unexpected error adding appointment:", error);
    }
  };

  return (
    <AppointmentContext.Provider
      value={{ appointments, setAppointments, addAppointment }}
    >
      {children}
    </AppointmentContext.Provider>
  );
};
