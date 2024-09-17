"use client";
/* eslint-disable @next/next/no-img-element */
import React, { useState } from "react";
import { Button, Form } from "react-bootstrap";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

import "./page.css";
const Home2 = () => {
  const [selectedValue, setSelectedValue] = useState("");
  const [isSelectVisible, setIsSelectVisible] = useState(false);
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);

  const handleChange = (event) => {
    setSelectedValue(event.target.value);
  };

  const handleButtonClick = () => {
    setIsSelectVisible(true);
  };

  const userProfile = {
    profileImage:
      "https://cdn.pixabay.com/photo/2017/07/18/23/23/user-2517433_1280.png",
  };

  return (
    <div className="profile-container">
      <div className="profile-header">
        <img
          src={userProfile.profileImage}
          alt="Profile"
          className="profile-image"
        />
        <h2>Demiresa</h2>
      </div>
      {isSelectVisible && (
        <div style={{ padding: "20px", fontFamily: "Arial, sans-serif" }}>
          <label htmlFor="select-menu" style={{ marginRight: "10px" }}></label>
          <select
            id="select-menu"
            value={selectedValue}
            onChange={handleChange}
            style={{ padding: "10px", fontSize: "16px", width: "300px" }}
          >
            <option value="">Bir cihaz seçin...</option>
            <option value="masaustu_bilgisayarlar">
              Masaüstü bilgisayarlar
            </option>
            <option value="dizustu_bilgisayarlar">Dizüstü bilgisayarlar</option>
            <option value="tabletler">Tabletler</option>
            <option value="monitorler">Monitörler</option>
            <option value="klavyeler">Klavyeler</option>
            <option value="fareler">Fareler</option>
            <option value="yazicilar_tarayicilar">
              Yazıcılar ve tarayıcılar
            </option>
            <option value="sabit_diskler_ssdler">
              Sabit diskler ve SSD&apos;ler
            </option>
            <option value="anakartlar_bilesenler">
              Anakartlar ve diğer bilgisayar bileşenleri
            </option>
            <option value="cep_telefonlari">Cep telefonları</option>
            <option value="akilli_telefonlar">Akıllı telefonlar</option>
            <option value="sarik_cihazlari">Şarj cihazları</option>
            <option value="bataryalar">Bataryalar</option>
            <option value="buzdolaplari">Buzdolapları</option>
            <option value="camasir_makineleri">Çamaşır makineleri</option>
            <option value="bulasik_makineleri">Bulaşık makineleri</option>
            <option value="mikrodalga_firinlar">Mikrodalga fırınlar</option>
            <option value="elektrikli_supurgeler">Elektrikli süpürgeler</option>
            <option value="sac_kurutma_makineleri">
              Saç kurutma makineleri
            </option>
            <option value="fotokopi_makineleri">Fotokopi makineleri</option>
            <option value="faks_makineleri">Faks makineleri</option>
            <option value="tarayicilar">Tarayıcılar</option>
            <option value="projektorler">Projektörler</option>
            <option value="televizyonlar">
              Televizyonlar (CRT, LCD, LED, Plazma)
            </option>
            <option value="dvd_blu_ray_oynaticilar">
              DVD/Blu-ray oynatıcılar
            </option>
            <option value="oyun_konsollari">Oyun konsolları</option>
            <option value="ses_sistemleri">
              Ses sistemleri ve hoparlörler
            </option>
            <option value="radyo_muzik_calarlar">
              Radyo ve müzik çalarlar
            </option>
            <option value="floresan_lambalar">Floresan lambalar</option>
            <option value="led_ampuller">LED ampuller</option>
            <option value="diger_aydinlatma_ekipmanlari">
              Diğer elektrikli aydınlatma ekipmanları
            </option>
            <option value="termometreler">Termometreler</option>
            <option value="kan_basinci_monitörleri">
              Kan basıncı monitörleri
            </option>
            <option value="sirnga_pompalari">Şırınga pompaları</option>
            <option value="modemler">Modemler</option>
            <option value="routerlar">Routerlar</option>
            <option value="telefon_santralleri">Telefon santralleri</option>
            <option value="antenler">Antenler</option>
            <option value="kullanilmis_piller">Kullanılmış piller</option>
            <option value="sarj_edilebilir_bataryalar">
              Şarj edilebilir bataryalar
            </option>
            <option value="arac_akuleri">Araç aküleri</option>
            <option value="elektrikli_oyuncaklar">Elektrikli oyuncaklar</option>
            <option value="elektrikli_aletler">
              Elektrikli aletler (matkaplar, testere vb.)
            </option>
            <option value="elektrikli_mutfak_aletleri">
              Elektrikli mutfak aletleri (kahve makineleri, blender vb.)
            </option>
            <option value="elektronik_saatler">Elektronik saatler</option>
          </select>
          <Form.Group
            className="mb-2 date-input"
            controlId="formAppointmentDate"
          >
            <Form.Label className="form-text">
              <h3> Randevu Başlangıç ve Bitiş Saatini Seçin</h3>
            </Form.Label>
            <DatePicker
              className="form-input-date"
              selected={startDate}
              onChange={(date) => setStartDate(date)}
              showTimeSelect
              dateFormat="dd/MM/yyyy h:mm aa"
              placeholderText="Başlangıç Saati Seçin"
              timeIntervals={15}
              timeCaption="Saat"
              minDate={new Date()}
            />

            <Form.Label
              className="form-text"
              style={{ marginTop: "20px" }}
            ></Form.Label>
            <DatePicker
              className="form-input-date"
              selected={endDate}
              onChange={(date) => setEndDate(date)}
              showTimeSelect
              dateFormat="dd/MM/yyyy h:mm aa"
              placeholderText="Bitiş Saati Seçin"
              timeIntervals={15}
              timeCaption="Saat"
              minDate={startDate || new Date()}
            />
          </Form.Group>
        </div>
      )}
      <Button
        variant="secondary"
        type="button"
        className="w-100 randevu-button"
        onClick={handleButtonClick}
      >
        Randevu Oluştur
      </Button>
    </div>
  );
};

export default Home2;
