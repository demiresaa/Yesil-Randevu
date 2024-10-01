"use client";
import React, { useState } from "react";
import { supabase } from "../../../lib/supabaseClient";
import { useRouter } from "next/navigation"; // Routing
import { motion } from "framer-motion"; // For animations
import "./page.css"; // Import your CSS

export function Kayit() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [address, setAddress] = useState("");
  const [day, setDay] = useState("");
  const [month, setMonth] = useState("");
  const [year, setYear] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const router = useRouter();
  const [isKvkkChecked, setIsKvkkChecked] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!isKvkkChecked) {
      setError("KVKK onayı verilmeden giriş yapılamaz.");
      return;
    }

    if (password !== confirmPassword) {
      setError("Şifreler eşleşmiyor.");
      return;
    }

    const today = new Date();
    const birthDate = new Date(year, month - 1, day);
    const age = today.getFullYear() - birthDate.getFullYear();
    const monthDifference = today.getMonth() - birthDate.getMonth();

    if (
      age < 18 ||
      (age === 18 &&
        (monthDifference < 0 ||
          (monthDifference === 0 && today.getDate() < day)))
    ) {
      setError("18 yaşından küçükler giremez.");
      return;
    }

    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
      });

      if (error) {
        setError("Kayıt başarısız: " + error.message);
        return;
      }

      const userID = data.user.id; // userID'yi burada tanımlıyoruz

      const { error: insertError } = await supabase
        .from("user-details")
        .insert([
          {
            userID,
            name,
            phoneNumber,
            address,
            birthDate: birthDate.toISOString().split("T")[0],
          },
        ]);

      if (insertError) {
        setError(
          "Ekstra bilgiler kaydedilirken hata oluştu: " + insertError.message
        );
        return;
      }

      console.log("Kayıt başarılı:", data);
      setSuccess(true);
      setTimeout(() => {
        router.push("/login");
      }, 1500);
    } catch (error) {
      setError("Beklenmeyen bir hata oluştu: " + error.message);
    }
  };

  return (
    <div className="custom-container">
      <div className="custom-row">
        <div className="custom-col">
          <form onSubmit={handleSubmit} className="custom-form">
            <div className="custom-form-group">
              <input
                className="custom-form-input"
                type="text"
                placeholder="Ad ve Soyad"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>
            <div className="custom-form-group">
              <input
                className="custom-form-input"
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="custom-form-group">
              <input
                className="custom-form-input"
                type="tel"
                placeholder="Telefon No"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
              />
            </div>
            <div className="custom-form-group">
              <textarea
                className="custom-form-input"
                placeholder="Adres"
                rows={3}
                value={address}
                onChange={(e) => setAddress(e.target.value)}
              ></textarea>
            </div>
            <div className="custom-form-group">
              <input
                className="custom-form-input"
                type="password"
                placeholder="Şifre"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            <div className="custom-form-group">
              <input
                className="custom-form-input"
                type="password"
                placeholder="Şifreyi Tekrar Gir"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
              />
            </div>
            <div className="custom-form-group">
              <label className="custom-form-text">Doğum Tarihi</label>
              <div className="custom-dob-inputs">
                <select value={day} onChange={(e) => setDay(e.target.value)}>
                  <option value="">Gün</option>
                  {[...Array(31).keys()].map((d) => (
                    <option key={d + 1} value={d + 1}>
                      {d + 1}
                    </option>
                  ))}
                </select>
                <select
                  value={month}
                  onChange={(e) => setMonth(e.target.value)}
                >
                  <option value="">Ay</option>
                  {[...Array(12).keys()].map((m) => (
                    <option key={m + 1} value={m + 1}>
                      {m + 1}
                    </option>
                  ))}
                </select>
                <select value={year} onChange={(e) => setYear(e.target.value)}>
                  <option value="">Yıl</option>
                  {[...Array(100).keys()].map((y) => (
                    <option key={2023 - y} value={2023 - y}>
                      {2023 - y}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            <button type="submit" className="custom-login-button">
              Kayıt Ol
            </button>
            {success && (
              <motion.div
                initial={{ opacity: 0, y: -50 }}
                animate={{ opacity: 1, y: 0 }}
                className="custom-success-alert"
              >
                Kayıt başarılı! Yönlendiriliyorsunuz...
              </motion.div>
            )}
            {error && <div className="custom-error-alert">{error}</div>}
            <a
              className="kvkk"
              target="_blank"
              href="https://www.resmigazete.gov.tr/eskiler/2018/03/20180310-5.htm"
              rel="noopener noreferrer"
            >
              KVKK Metni Okumak İçin Tıklayın
            </a>
            <div className="kvkk-kutu">
              <input
                type="checkbox"
                id="cbx"
                checked={isKvkkChecked}
                onChange={() => setIsKvkkChecked(!isKvkkChecked)}
              />
              <label htmlFor="cbx">KVKK Onayı</label>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Kayit;
