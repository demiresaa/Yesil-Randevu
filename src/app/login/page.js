// Login.js:
"use client"; // Eğer bu sayfanın client-side çalışmasını istiyorsanız
import "bootstrap/dist/css/bootstrap.min.css";

import React, { useState } from "react";
import { Form, Button, Container, Row, Col } from "react-bootstrap";
import "./page.css";
import Link from "next/link"; // Next.js Link bileşeni

export function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (event) => {
    event.preventDefault();
    console.log("Login attempted with:", { email, password });
    // Burada tipik olarak sunucunuza bir istek gönderirsinizW
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
              />
            </Form.Group>
            <Button
              variant="secondary"
              type="submit"
              className="w-100 login-button"
            >
              Giriş Yap
            </Button>
            <Link href="/kayit" className="kayıt">
              Kayıt Ol
            </Link>
            <Link
              className="kvkk"
              href="https://www.resmigazete.gov.tr/eskiler/2018/03/20180310-5.htm"
            >
              KVKK Metni Okumak İçin Tıklayın
            </Link>

            <input
              type="checkbox"
              id="cbx"
              style={{ opacity: 0, position: "absolute" }}
            />
            <label for="cbx" className="check">
              <svg width="18px" height="18px" viewBox="0 0 18 18">
                <path d="M1,9 L1,3.5 C1,2 2,1 3.5,1 L14.5,1 C16,1 17,2 17,3.5 L17,14.5 C17,16 16,17 14.5,17 L3.5,17 C2,17 1,16 1,14.5 L1,9 Z"></path>
                <polyline points="1 9 7 14 15 4"></polyline>
              </svg>
            </label>
          </Form>
        </Col>
      </Row>
    </Container>
  );
}

export default Login;
