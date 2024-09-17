"use client";
import "bootstrap/dist/css/bootstrap.min.css";
import React, { useState } from "react";
import { Form, Button, Container, Row, Col, Alert } from "react-bootstrap";
import "./page.css";
import { supabase } from "../../../lib/supabaseClient";
import { useRouter } from "next/navigation"; // Değişiklik burada
import { motion } from "framer-motion"; // Animasyon için framer-motion'ı import edin

export function Kayit() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [day, setDay] = useState("");
  const [address, setAddress] = useState("");

  const [month, setMonth] = useState("");
  const [year, setYear] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const router = useRouter();

  const handleSubmit = async (event) => {
    event.preventDefault();

    // Şifre eşleşmesi kontrolü
    if (password !== confirmPassword) {
      setError("Şifreler eşleşmiyor.");
      return;
    }

    // Yaş kontrolü
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
      // Supabase'e kullanıcı kaydı
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
      });

      if (error) {
        setError("Kayıt başarısız: " + error.message);
        return;
      }

      // Ekstra bilgileri 'profiles' tablosuna kaydetme
      const { error: insertError } = await supabase
        .from("user-details")
        .insert([
          {
            id: data.user.id, // Supabase tarafından oluşturulan user id
            name,
            phoneNumber,
            address,
            birthDate: birthDate.toISOString().split("T")[0], // YYY-MM-DD formatında
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
        router.push("/kayit"); // Ana sayfaya yönlendirme
      }, 1500);
    } catch (error) {
      setError("Beklenmeyen bir hata oluştu: " + error.message);
    }
  };

  return (
    <Container>
      <Row className="justify-content-md-center mt-5">
        <Col s={10} lg={4}>
          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-1" controlId="formBasicEmail">
              <Form.Label className="form-text"></Form.Label>
              <Form.Control
                className="form-input"
                type="text"
                placeholder="Ad ve Soyad"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
              <Form.Label className="form-text"></Form.Label>
              <Form.Control
                className="form-input"
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </Form.Group>
            <Form.Group className="mb-2" controlId="formBasicPhoneNumber">
              <Form.Label className="form-text"></Form.Label>
              <Form.Control
                className="form-input"
                type="tel"
                placeholder="Telefon No"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
              />
              <Form.Group className="mb-2" controlId="formBasicAddress">
                <Form.Label className="form-text"></Form.Label>
                <Form.Control
                  className="form-input"
                  as="textarea"
                  rows={3}
                  placeholder="Adres"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                />
              </Form.Group>
            </Form.Group>
            <Form.Group className="mb-2" controlId="formBasicPassword">
              <Form.Label className="form-text"></Form.Label>
              <Form.Control
                className="form-input"
                type="password"
                placeholder="Şifre"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </Form.Group>

            <Form.Group className="mb-2" controlId="formConfirmPassword">
              <Form.Label className="form-text"></Form.Label>
              <Form.Control
                className="form-input"
                type="password"
                placeholder="Şifreyi Tekrar Gir"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
            </Form.Group>

            <Form.Group className="mb-2" controlId="formDateOfBirth">
              <Form.Label className="form-text">Doğum Tarihi</Form.Label>
              <div className="d-flex">
                <Form.Select
                  className="me-2"
                  value={day}
                  onChange={(e) => setDay(e.target.value)}
                >
                  <option value="">Gün</option>
                  {[...Array(31).keys()].map((d) => (
                    <option key={d + 1} value={d + 1}>
                      {d + 1}
                    </option>
                  ))}
                </Form.Select>

                <Form.Select
                  className="me-2"
                  value={month}
                  onChange={(e) => setMonth(e.target.value)}
                >
                  <option value="">Ay</option>
                  {[...Array(12).keys()].map((m) => (
                    <option key={m + 1} value={m + 1}>
                      {m + 1}
                    </option>
                  ))}
                </Form.Select>

                <Form.Select
                  value={year}
                  onChange={(e) => setYear(e.target.value)}
                >
                  <option value="">Yıl</option>
                  {[...Array(100).keys()].map((y) => (
                    <option key={2023 - y} value={2023 - y}>
                      {2023 - y}
                    </option>
                  ))}
                </Form.Select>
              </div>
              {success && (
                <motion.div
                  initial={{ opacity: 0, y: -50 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="success-alert"
                >
                  <span className="success-icon">✓</span>
                  Kayıt başarılı! Yönlendiriliyorsunuz...
                </motion.div>
              )}
              {error && (
                <Alert variant="danger" className="error-alert">
                  {error}
                </Alert>
              )}
            </Form.Group>

            <Button
              variant="secondary"
              type="submit"
              className="w-100 login-button"
            >
              Kayıt Ol
            </Button>
          </Form>
        </Col>
      </Row>
    </Container>
  );
}

export default Kayit;
