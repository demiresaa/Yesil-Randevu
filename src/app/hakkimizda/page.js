// src/app/hakkımızda/page.js

import React from "react";
import "./pagee.css"; // CSS dosyası varsa bu satırı bırakın

const Hakkimizda = () => {
  return (
    <div className="home-containerr">
      <section className="hero-sectionn">
        <h1>Elektronik Atık Nedir ve Dönüşümleri Neden Önemlidir?</h1>
        <p>
          Atık Elektrikli ve Elektronik Eşyaların Kontrolü Yönetmeliği’ne göre
          elektronik eşya kapsamına giren ve kullanım ömrünü tamamlamış veya
          kullanıcı tarafından artık kullanılmak istenmeyen tüm cihazlar e-atık
          olarak nitelendirilir. E-atıkların büyük çoğunluğu bromlu alev
          geciktirici, klorlu solventler, PVC, zararlı metaller, kurşun, cıva,
          berilyum, kadmiyum gibi çevreye dağılması durumunda ciddi oranda
          kirliliğe neden olacak, doğal yaşam alanlarına ve insan hayatına ciddi
          zarar verebilecek kimyasallar içerir. E-atıkların toplanması ile çevre
          kirliliğinin engellenmesinin yanı sıra e-atıkların içerdiği değerli
          malzemelerin geri kazanılması ile enerji tasarrufu sağlanır.
        </p>
      </section>

      <section className="mission-visionn">
        <div className="missionn">
          <h2>Misyonumuz</h2>
          <p>
            Elektronik atıkların doğru ve sürdürülebilir şekilde toplanmasını
            teşvik ederek, çevreye zarar veren atıkların geri dönüşümünü
            sağlamak ve toplumda çevre bilinci oluşturmaktır ödüllendirme
            sistemine dayalı yenilikçi mobil uygulamamız aracılığıyla
            kullanıcıların bu sürece aktif katılımını kolaylaştırarak, daha
            temiz ve sağlıklı yaşam alanlarının oluşturulmasına katkıda
            bulunmak.
          </p>
        </div>
        <div className="visionn">
          <h2>Vizyonumuz</h2>
          <p>
            Elektronik atıkların yönetiminde lider bir platform olarak, toplumun
            çevresel sorumluluğunu arttıran çözümler sunmak ve çevreye duyarlı
            bir gelecek için dönüşüm süreçlerini küresel ölçekte
            yaygınlaştırmak.
          </p>
        </div>
      </section>
    </div>
  );
};

export default Hakkimizda;
