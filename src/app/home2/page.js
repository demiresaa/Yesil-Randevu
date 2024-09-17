"use client";
/* eslint-disable @next/next/no-img-element */
import React, { useState, useEffect } from "react";
import { Button, Form, Alert } from "react-bootstrap";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { useRouter } from "next/navigation";
import { withAuth } from "../../components/withAuth";

import "./page.css";

const Home2 = () => {
  const [selectedValues, setSelectedValues] = useState([]);
  const [isSelectVisible, setIsSelectVisible] = useState(false);
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [isFormValid, setIsFormValid] = useState(false);
  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  const [alertVariant, setAlertVariant] = useState("success");
  const router = useRouter();

  useEffect(() => {
    setIsFormValid(selectedValues.length > 0 && startDate && endDate);
  }, [selectedValues, startDate, endDate]);

  const handleChange = (event) => {
    const value = event.target.value;
    setSelectedValues((prevValues) =>
      event.target.checked
        ? [...prevValues, value]
        : prevValues.filter((v) => v !== value)
    );
  };

  const handleButtonClick = () => {
    setIsSelectVisible(true);
  };

  const handleRandevuOlustur = () => {
    if (!isFormValid) {
      setAlertMessage("Lütfen bilgileri doğru bir şekilde giriniz.");
      setAlertVariant("danger");
      setShowAlert(true);
      return;
    }

    const randevuBilgileri = {
      secilenCihazlar: selectedValues,
      baslangicTarihi: startDate,
      bitisTarihi: endDate,
    };
    console.log("Randevu Bilgileri:", randevuBilgileri);

    setAlertMessage("Randevunuz başarıyla oluşturuldu!");
    setAlertVariant("success");
    setShowAlert(true);

    // State'leri sıfırla
    setSelectedValues([]);
    setIsSelectVisible(false);
    setStartDate(null);
    setEndDate(null);

    // 3 saniye sonra alert'i kaldır ve Home2 sayfasını yeniden yükle
    setTimeout(() => {
      setShowAlert(false);
      router.push("/home2");
    }, 3000);
  };

  const userProfile = {
    profileImage:
      "https://cdn.pixabay.com/photo/2017/07/18/23/23/user-2517433_1280.png",
  };

  const options = [
    { value: "masaustu_bilgisayarlar", label: "Masaüstü bilgisayarlar" },
    { value: "dizustu_bilgisayarlar", label: "Dizüstü bilgisayarlar" },
    { value: "tabletler", label: "Tabletler" },
    { value: "monitorler", label: "Monitörler" },
    { value: "klavyeler", label: "Klavyeler" },
    { value: "fareler", label: "Fareler" },
    { value: "yazicilar_tarayicilar", label: "Yazıcılar ve tarayıcılar" },
    { value: "sabit_diskler_ssdler", label: "Sabit diskler ve SSD'ler" },
    {
      value: "anakartlar_bilesenler",
      label: "Anakartlar ve diğer bilgisayar bileşenleri",
    },
    { value: "cep_telefonlari", label: "Cep telefonları" },
    { value: "akilli_telefonlar", label: "Akıllı telefonlar" },
    { value: "sarik_cihazlari", label: "Şarj cihazları" },
    { value: "bataryalar", label: "Bataryalar" },
    { value: "buzdolaplari", label: "Buzdolapları" },
    { value: "camasir_makineleri", label: "Çamaşır makineleri" },
    { value: "bulasik_makineleri", label: "Bulaşık makineleri" },
    { value: "mikrodalga_firinlar", label: "Mikrodalga fırınlar" },
    { value: "elektrikli_supurgeler", label: "Elektrikli süpürgeler" },
    { value: "sac_kurutma_makineleri", label: "Saç kurutma makineleri" },
    { value: "fotokopi_makineleri", label: "Fotokopi makineleri" },
    { value: "faks_makineleri", label: "Faks makineleri" },
    { value: "tarayicilar", label: "Tarayıcılar" },
    { value: "projektorler", label: "Projektörler" },
    { value: "televizyonlar", label: "Televizyonlar (CRT, LCD, LED, Plazma)" },
    { value: "dvd_blu_ray_oynaticilar", label: "DVD/Blu-ray oynatıcılar" },
    { value: "oyun_konsollari", label: "Oyun konsolları" },
    { value: "ses_sistemleri", label: "Ses sistemleri ve hoparlörler" },
    { value: "radyo_muzik_calarlar", label: "Radyo ve müzik çalarlar" },
    { value: "floresan_lambalar", label: "Floresan lambalar" },
    { value: "led_ampuller", label: "LED ampuller" },
    {
      value: "diger_aydinlatma_ekipmanlari",
      label: "Diğer elektrikli aydınlatma ekipmanları",
    },
    { value: "termometreler", label: "Termometreler" },
    { value: "kan_basinci_monitörleri", label: "Kan basıncı monitörleri" },
    { value: "sirnga_pompalari", label: "Şırınga pompaları" },
    { value: "modemler", label: "Modemler" },
    { value: "routerlar", label: "Routerlar" },
    { value: "telefon_santralleri", label: "Telefon santralleri" },
    { value: "antenler", label: "Antenler" },
    { value: "kullanilmis_piller", label: "Kullanılmış piller" },
    {
      value: "sarj_edilebilir_bataryalar",
      label: "Şarj edilebilir bataryalar",
    },
    { value: "arac_akuleri", label: "Araç aküleri" },
    { value: "elektrikli_oyuncaklar", label: "Elektrikli oyuncaklar" },
    {
      value: "elektrikli_aletler",
      label: "Elektrikli aletler (matkaplar, testere vb.)",
    },
    {
      value: "elektrikli_mutfak_aletleri",
      label: "Elektrikli mutfak aletleri (kahve makineleri, blender vb.)",
    },
    { value: "elektronik_saatler", label: "Elektronik saatler" },
  ];
  return (
    <div className="profile-container">
      <div className="profile-header">
        <img
          src={userProfile.profileImage}
          alt="Profile"
          className="profile-image"
        />
        <h2>Demiresa</h2>
        <h3 className="puan">
          Puanım:<span>0</span>
        </h3>
      </div>
      {showAlert && (
        <Alert
          variant={alertVariant}
          onClose={() => setShowAlert(false)}
          dismissible
        >
          {alertMessage}
        </Alert>
      )}
      {isSelectVisible && (
        <div
          className="profile-category"
          style={{ padding: "20px", fontFamily: "Arial, sans-serif" }}
        >
          <h4>Bir veya birden fazla cihaz seçin:</h4>
          <div style={{ maxHeight: "200px", overflowY: "auto" }}>
            {options.map((option) => (
              <div key={option.value}>
                <input
                  type="checkbox"
                  id={option.value}
                  value={option.value}
                  checked={selectedValues.includes(option.value)}
                  onChange={handleChange}
                />
                <label htmlFor={option.value}>{option.label}</label>
              </div>
            ))}
          </div>
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
        type="button"
        className="w-100 randevu-button"
        onClick={isSelectVisible ? handleRandevuOlustur : handleButtonClick}
      >
        {isSelectVisible ? "Randevu Oluştur" : "Randevu Oluşturmaya Başla"}
      </Button>
    </div>
  );
};

export default withAuth(Home2);
