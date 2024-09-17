"use client";

import React, { useState } from "react";
import Link from "next/link";
import "./NavBar.css";
import { HamburgetMenuClose, HamburgetMenuOpen } from "./Icon.js";
import { Person } from "react-bootstrap-icons";

function NavBar() {
  const [click, setClick] = useState(false);

  const handleClick = () => setClick(!click);
  return (
    <>
      <nav className="navbar">
        <div className="nav-container">
          <Link href="/" className="nav-logo">
            <span>Yeşil Randevu</span>
            {/* <i className="fas fa-code"></i> */}
          </Link>

          <ul className={click ? "nav-menu active" : "nav-menu"}>
            <li className="nav-item">
              <Link href="/" className="nav-links" onClick={handleClick}>
                Ana Sayfa
              </Link>
            </li>
            <li className="nav-item">
              <Link href="/profile" className="nav-links" onClick={handleClick}>
                Kişisel Bilgilerim
              </Link>
            </li>
            <li className="nav-item">
              <Link
                href="/randevular"
                className="nav-links"
                onClick={handleClick}
              >
                Randevularım
              </Link>
            </li>
            <li className="nav-item">
              <Link href="/login" className="nav-links" onClick={handleClick}>
                <Person className="bi bi-person" /> Giriş Yap
              </Link>
            </li>
          </ul>
          <div className="nav-icon" onClick={handleClick}>
            {click ? (
              <span className="icon">
                <HamburgetMenuClose /> {/* Kapama simgesi */}
              </span>
            ) : (
              <span className="icon">
                <HamburgetMenuOpen /> {/* Açma simgesi */}
              </span>
            )}
          </div>
        </div>
      </nav>
    </>
  );
}

export default NavBar;
