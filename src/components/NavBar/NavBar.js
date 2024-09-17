"use client";

import React, { useEffect, useState } from "react";
import "./NavBar.css";
import { HamburgetMenuClose, HamburgetMenuOpen } from "./Icon.js";
import { Person } from "react-bootstrap-icons";
import { supabase } from "../../../lib/supabaseClient";
import { useRouter } from "next/navigation";

function NavBar() {
  const [click, setClick] = useState(false);
  const [user, setUser] = useState(null);
  const router = useRouter();

  const handleClick = () => setClick(!click);

  useEffect(() => {
    getUser();
  }, []);

  const getUser = async () => {
    const {
      data: { user },
    } = await supabase.auth.getUser();
    setUser(user);
  };

  const handleSignOut = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      console.error("Çıkış yapılırken hata oluştu:", error);
    } else {
      setUser(null);
      router.push("/");
    }
  };

  const handleNavigation = (path) => {
    router.push(path);
  };

  const homeLink = user ? "/home2" : "/";

  return (
    <>
      <nav className="navbar">
        <div className="nav-container">
          <a
            href={homeLink}
            className="nav-logo"
            onClick={(e) => {
              e.preventDefault();
              handleNavigation(homeLink);
            }}
          >
            <span>Yeşil Randevu</span>
          </a>

          <ul className={click ? "nav-menu active" : "nav-menu"}>
            <li className="nav-item">
              <a
                href={homeLink}
                className="nav-links"
                onClick={(e) => {
                  e.preventDefault();
                  handleNavigation(homeLink);
                }}
              >
                Ana Sayfa
              </a>
            </li>
            <li className="nav-item">
              <a
                href="/hakkimizda"
                className="nav-links"
                onClick={(e) => {
                  e.preventDefault();
                  handleNavigation("/hakkimizda");
                }}
              >
                Hakkımızda
              </a>
            </li>
            {user ? (
              <>
                <li className="nav-item">
                  <a
                    href="/profile"
                    className="nav-links"
                    onClick={(e) => {
                      e.preventDefault();
                      handleNavigation("/profile");
                    }}
                  >
                    Kişisel Bilgilerim
                  </a>
                </li>
                <li className="nav-item">
                  <a
                    href="/randevular"
                    className="nav-links"
                    onClick={(e) => {
                      e.preventDefault();
                      handleNavigation("/randevular");
                    }}
                  >
                    Randevularım
                  </a>
                </li>
                <li className="nav-item nav-item1">
                  <a href="#" className="nav-links" onClick={handleSignOut}>
                    <Person className="bi bi-person" /> Çıkış Yap
                  </a>
                </li>
              </>
            ) : (
              <li className="nav-item nav-item1">
                <a
                  href="/login"
                  className="nav-links"
                  onClick={(e) => {
                    e.preventDefault();
                    handleNavigation("/login");
                  }}
                >
                  <Person className="bi bi-person" /> Giriş Yap
                </a>
              </li>
            )}
          </ul>
          <div className="nav-icon" onClick={handleClick}>
            {click ? (
              <span className="icon">
                <HamburgetMenuClose />
              </span>
            ) : (
              <span className="icon">
                <HamburgetMenuOpen />
              </span>
            )}
          </div>
        </div>
      </nav>
    </>
  );
}

export default NavBar;
