/* eslint-disable @next/next/no-img-element */
import React from "react";
import "./page.css";

const Home = () => {
  return (
    <div className="home-container">
      <section className="hero-section">
        <h1>HEM</h1>
        <h4>Doğaya Katkı Sağla!</h4>
        <p>
          Elektronik atıklarını geri dönüştürerek doğaya katkı ve cennet
          vatanımızın ekonomisine katkı sağla.
        </p>

        <h1>HEM</h1>
        <h4>Fazlalıklarından Kurtul!</h4>
        <p>
          Elinde bulunan elektronik fazlalıklarından kurtulmak için zahmete
          girme.
        </p>

        <h1>HEM DE</h1>
        <h4>Ödül ve Ayrıcalıklarından Faydalan!</h4>
      </section>
      {/* Add Image */}
      <img
        src="/resim19.jpg"
        alt="Recycling Image"
        className="recycling-image"
      />
    </div>
  );
};

export default Home;
