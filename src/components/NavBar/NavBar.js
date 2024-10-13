"use client";
import React, { useEffect, useState } from "react";
import { HamburgetMenuClose, HamburgetMenuOpen } from "./Icon.js";
import { Person } from "react-bootstrap-icons";
import { supabase } from "../../../lib/supabaseClient";
import { useRouter } from "next/navigation";
import Link from "next/link";
import "./NavBar.css";

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
      router.push("/login");
    }
  };

  const homeLink = user ? "/home2" : "/";

  return (
    <>
      <nav className="navbar no-print">
        <div className="nav-container">
          <Link href={homeLink} className="nav-logo">
            <span>Yeşil Randevu</span>
          </Link>

          <ul className={click ? "nav-menu active" : "nav-menu"}>
            <li onClick={handleClick} className="nav-item">
              <Link href={homeLink} className="nav-links">
                Ana Sayfa
              </Link>
            </li>
            {/* Hakkımızda bağlantısını yalnızca kullanıcı giriş yapmadığında göster */}
            {!user && (
              <li onClick={handleClick} className="nav-item">
                <Link href="/hakkimizda" className="nav-links">
                  Hakkımızda
                </Link>
              </li>
            )}
            {user ? (
              <>
                <li onClick={handleClick} className="nav-item">
                  <Link href="/profile" className="nav-links">
                    Kişisel Bilgilerim
                  </Link>
                </li>
                <li onClick={handleClick} className="nav-item">
                  <Link href="/randevular" className="nav-links">
                    Randevularım
                  </Link>
                </li>
                {/* Kullanıcı e-posta adresi kontrolü */}
                {user.email === "demiresa38@gmail.com" && (
                  <li onClick={handleClick} className="nav-item">
                    <Link href="/raporlar" className="nav-links">
                      Raporlar
                    </Link>
                  </li>
                )}
                <li onClick={handleClick} className="nav-item nav-item1">
                  <a href="#" className="nav-links" onClick={handleSignOut}>
                    <Person className="bi bi-person" /> Çıkış Yap
                  </a>
                </li>
              </>
            ) : (
              <li onClick={handleClick} className="nav-item nav-item1">
                <Link href="/login" className="nav-links">
                  <Person className="bi bi-person" /> Giriş Yap
                </Link>
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
