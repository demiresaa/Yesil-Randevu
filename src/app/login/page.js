"use client";
import "bootstrap/dist/css/bootstrap.min.css";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Form, Button, Container, Row, Col, Alert } from "react-bootstrap";
import { supabase } from "../../../lib/supabaseClient";
import { useAuth } from "../contexts/AuthContext";
import "./page.css";

export function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isKvkkChecked, setIsKvkkChecked] = useState(false);
  const router = useRouter();
  const auth = useAuth();

  useEffect(() => {
    const subscription = supabase.auth.onAuthStateChange((event, session) => {
      if (auth?.user) {
        router.push("/home2");
      }
    });

    return () => {
      if (subscription && typeof subscription.unsubscribe === "function") {
        subscription.unsubscribe();
      }
    };
  }, [auth?.user, router]);

  const handleKayitClick = (e) => {
    e.preventDefault();
    router.push("/kayit");
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");

    if (!isKvkkChecked) {
      setError("KVKK onayı verilmeden giriş yapılamaz.");
      return;
    }

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
        router.push("/home2");
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
    <Container>
      <Row className="justify-content-md-center mt-5">
        <Col s={10} lg={4}>
          <Form onSubmit={handleSubmit}>
            <Form.Group controlId="formBasicEmail">
              <Form.Label className="form-text"></Form.Label>
              <Form.Control
                className="form-input"
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </Form.Group>
            <Form.Group controlId="formBasicPassword">
              <Form.Label className="form-text"></Form.Label>
              <Form.Control
                className="form-input"
                type="password"
                placeholder="Şifre"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </Form.Group>
            <Button
              variant="secondary"
              type="submit"
              className="w-100 login-button"
            >
              Giriş Yap
            </Button>
            {error && (
              <Alert variant="danger" className="error-alert">
                {error}
              </Alert>
            )}
            <Button variant="link" onClick={handleKayitClick} className="kayıt">
              Kayıt Ol
            </Button>
            <a
              className="kvkk"
              target="_blank"
              href="https://www.resmigazete.gov.tr/eskiler/2018/03/20180310-5.htm"
              rel="noopener noreferrer"
            >
              KVKK Metni Okumak İçin Tıklayın
            </a>
            <div className="align-items-center mb-3">
              <div className="custom-control custom-checkbox mr-auto">
                <input
                  type="checkbox"
                  className="custom-control-input"
                  id="cbx"
                  checked={isKvkkChecked}
                  onChange={() => setIsKvkkChecked(!isKvkkChecked)}
                />
              </div>
            </div>
          </Form>
        </Col>
      </Row>
    </Container>
  );
}
export default Login;
