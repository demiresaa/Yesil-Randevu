// src/app/hakkımızda/page.js

import React from "react";
import "./pagee.css"; // CSS dosyası varsa bu satırı bırakın

const Hakkimizda = () => {
  return (
    <div className="home-containerr">
      <section className="hero-sectionn">
        <h1>E-Atıkları Geri Dönüştür, Doğayı Koru!</h1>
        <p>
          E-atıkların doğru şekilde geri dönüştürülmesi, doğal kaynaklarımızı
          koruma ve çevre kirliliğini azaltma konusunda kritik öneme sahiptir.
        </p>
      </section>

      <section className="mission-visionn">
        <div className="missionn">
          <h2>Misyonumuz</h2>
          <p>
            Misyonumuz, elektronik atıkların çevre dostu ve sürdürülebilir bir
            şekilde geri dönüştürülmesini sağlamak, böylece çevremizi ve doğal
            kaynaklarımızı korumaktır.
          </p>
        </div>
        <div className="visionn">
          <h2>Vizyonumuz</h2>
          <p>
            Vizyonumuz, e-atık yönetiminde lider bir rol üstlenmek ve toplumu
            çevre bilinci konusunda bilinçlendirerek, daha temiz ve yeşil bir
            gezegen yaratmaktır.
          </p>
        </div>
      </section>

      <section className="info-sectionn">
        <h2>E-atık Nedir ve Neden Önemlidir?</h2>
        <p>
          E-atık, eski veya işlevsiz elektronik cihazlardan oluşan atıklardır.
          Bu atıkların çoğu, zararlı kimyasallar ve ağır metaller içerebilir, bu
          da çevre ve insan sağlığı için büyük riskler oluşturur. E-atıkları
          uygun şekilde geri dönüştürmek, bu zararlı maddelerin doğaya
          yayılmasını önler ve değerli malzemelerin yeniden kullanımını sağlar.
        </p>
      </section>
    </div>
  );
};

export default Hakkimizda;
