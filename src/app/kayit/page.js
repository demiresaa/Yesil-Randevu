"use client";
import "bootstrap/dist/css/bootstrap.min.css";

import React, { useState } from "react";
import { Form, Button, Container, Row, Col } from "react-bootstrap";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import "./page.css";

export function Kayit() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [dateOfBirth, setDateOfBirth] = useState(null);

  const handleSubmit = (event) => {
    event.preventDefault();
    console.log("Login attempted with:", {
      email,
      password,
      phoneNumber,
      dateOfBirth,
    });
    // Here you would typically send a request to your server
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
            </Form.Group>
            <Form.Group
              className="mb-2"
              sx={{ color: "red" }}
              controlId="formBasicPassword"
            >
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
              <Form.Label className="form-text"></Form.Label>
              <DatePicker
                className="form-input-date"
                selected={dateOfBirth}
                onChange={(date) => setDateOfBirth(date)}
                dateFormat="dd/MM/yyyy"
                placeholderText="Doğum Tarihi Seçin"
              />
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
