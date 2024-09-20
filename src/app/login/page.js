"use client";
import React, { useState } from "react";
import { supabase } from "../../../lib/supabaseClient";
import "./page.css";

export function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleKayitClick = (e) => {
    e.preventDefault();
    window.location.href = "/kayit";
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        console.error("Giriş hatası:", error);
        setError(
          error.message || "Giriş başarısız. Lütfen bilgilerinizi kontrol edin."
        );
        return;
      }

      if (data?.user) {
        console.log("Giriş başarılı!", data.user);
        // Email kontrolü
        if (data.user.email === "demiresa38@gmail.com") {
          window.location.href = "/randevu2";
        } else {
          window.location.href = "/home2";
        }
      } else {
        setError(
          "Beklenmeyen bir hata oluştu. Lütfen daha sonra tekrar deneyin."
        );
      }
    } catch (err) {
      console.error("Beklenmeyen hata:", err);
      setError("Bir hata oluştu. Lütfen tekrar deneyin.");
    }
  };

  return (
    <div className="container">
      <div className="row">
        <div className="col">
          <form onSubmit={handleSubmit} className="form">
            <div className="form-group">
              <label className="form-text"></label>
              <input
                className="form-input"
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="form-group">
              <label className="form-text"></label>
              <input
                className="form-input"
                type="password"
                placeholder="Şifre"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            <button type="submit" className="login-button">
              Giriş Yap
            </button>
            {error && <div className="error-alert">{error}</div>}
            <button
              type="button"
              onClick={handleKayitClick}
              className="kayıt-button"
            >
              Kayıt Ol
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
export default Login;
