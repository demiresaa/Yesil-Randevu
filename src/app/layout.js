"use client"; // Bu satırı ekleyin

import "./globals.css";
import NavBar from "@/components/NavBar/NavBar";
import Footer from "@/components/footer/footer";
import { AuthProvider } from "./contexts/AuthContext";

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <AuthProvider>
          <NavBar />
          <div className="pages">{children}</div>
          <Footer />
        </AuthProvider>
      </body>
    </html>
  );
}
