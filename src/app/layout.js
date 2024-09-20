"use client"; // Bu satırı ekleyin

import "./globals.css";
import NavBar from "@/components/NavBar/NavBar";
import Footer from "@/components/footer/footer";
import { AuthProvider } from "../context/AuthContext";
import { AppointmentProvider } from "../context/AppointmentContext";

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <AppointmentProvider>
          <AuthProvider className="pages">
            <NavBar />
            <div>{children}</div>
            <Footer />
          </AuthProvider>
        </AppointmentProvider>
      </body>
    </html>
  );
}
