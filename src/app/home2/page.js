/* eslint-disable @next/next/no-img-element */
"use client";
import React, { useState, useEffect, useContext } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { withAuth } from "../../components/withAuth";
import styles from "./Home2.module.css";
import { AppointmentContext } from "../../context/AppointmentContext";
import { useAuth } from "../../context/AuthContext";
import { supabase } from "../../../lib/supabaseClient"; // supabase istemcisini doğru şekilde içe aktarın

const Home2 = ({ setIsBanned }) => {
  const { user } = useAuth(); // AuthContext'ten kullanıcı bilgilerini al
  const { addAppointment } = useContext(AppointmentContext); // AppointmentContext'ten addAppointment fonksiyonunu al
  const [selectedValues, setSelectedValues] = useState([]);
  const [isSelectVisible, setIsSelectVisible] = useState(false);
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [isFormValid, setIsFormValid] = useState(false);
  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  const [alertVariant, setAlertVariant] = useState("success");
  const [userName, setUserName] = useState(""); // State to store the name
  const [totalScore, setTotalScore] = useState(0); // State to store the total score

  useEffect(() => {
    setIsFormValid(selectedValues.length > 0 && startDate && endDate);
  }, [selectedValues, startDate, endDate]);

  useEffect(() => {
    const fetchUserName = async () => {
      if (user) {
        try {
          const { data, error } = await supabase
            .from("user-details")
            .select("name") // Fetch the name column
            .eq("userID", user.id) // Match the authenticated user ID
            .single();

          if (error) {
            console.error("Error fetching user name:", error);
          } else {
            setUserName(data.name); // Set the name in state
          }
        } catch (error) {
          console.error("Error fetching user name:", error.message);
        }
      }
    };

    fetchUserName();
  }, [user]);

  useEffect(() => {
    const fetchUserScore = async () => {
      if (user) {
        try {
          const { data, error } = await supabase
            .from("user-details")
            .select("totalScore") // Fetch the total_score column
            .eq("userID", user.id) // Match the authenticated user ID
            .single();

          if (error) {
            console.error("Error fetching user score:", error);
          } else {
            setTotalScore(data.totalScore); // Set the total score in state
          }
        } catch (error) {
          console.error("Error fetching user score:", error.message);
        }
      }
    };

    fetchUserScore();
  }, [user]);

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

  const handleRandevuOlustur = async () => {
    if (!isFormValid) {
      setAlertMessage("Lütfen bilgileri doğru bir şekilde giriniz.");
      setAlertVariant("error");
      setShowAlert(true);
      return;
    }

    const randevuBilgileri = {
      secilenCihazlar: selectedValues,
      baslangicTarihi: startDate,
      bitisTarihi: endDate,
    };

    // Seçilen cihazların toplam puanını hesapla
    const totalScore = selectedValues.reduce((acc, value) => {
      const option = options.find((opt) => opt.value === value);
      return acc + (option ? option.score : 0);
    }, 0);

    try {
      await addAppointment({
        userID: user.id, // userID'yi ekle
        category: randevuBilgileri.secilenCihazlar.join(", "),
        start_date: randevuBilgileri.baslangicTarihi,
        end_date: randevuBilgileri.bitisTarihi,
        isApproved: false,
        score: totalScore, // Toplam puanı ekle
      });

      setAlertMessage("Randevunuz başarıyla oluşturuldu!");
      setAlertVariant("success");
      setShowAlert(true);

      setSelectedValues([]);
      setIsSelectVisible(false);
      setStartDate(null);
      setEndDate(null);
    } catch (error) {
      setAlertMessage("Randevu oluşturulurken bir hata oluştu.");
      setAlertVariant("error");
      setShowAlert(true);
      console.error("Error creating appointment:", error);
    }
  };

  const userProfile = {
    profileImage:
      "https://cdn.pixabay.com/photo/2017/07/18/23/23/user-2517433_1280.png",
  };

  const options = [
    {
      value: "masaustu_bilgisayarlar",
      label: "Masaüstü bilgisayarlar",
      score: 42,
    },
    {
      value: "dizustu_bilgisayarlar",
      label: "Dizüstü bilgisayarlar",
      score: 45,
    },
    { value: "tabletler", label: "Tabletler", score: 37 },
    { value: "monitorler", label: "Monitörler", score: 40 },
    { value: "klavyeler", label: "Klavyeler", score: 35 },
    { value: "fareler", label: "Fareler", score: 32 },
    {
      value: "yazicilar_tarayicilar",
      label: "Yazıcılar ve tarayıcılar",
      score: 30,
    },
    {
      value: "sabit_diskler_ssdler",
      label: "Sabit diskler ve SSD'ler",
      score: 48,
    },
    {
      value: "anakartlar_bilesenler",
      label: "Anakartlar ve diğer bilgisayar bileşenleri",
      score: 42,
    },
    { value: "cep_telefonlari", label: "Cep telefonları", score: 45 },
    { value: "akilli_telefonlar", label: "Akıllı telefonlar", score: 48 },
    { value: "sarj_cihazlari", label: "Şarj cihazları", score: 25 },
    { value: "bataryalar", label: "Bataryalar", score: 27 },
    { value: "buzdolaplari", label: "Buzdolapları", score: 40 },
    { value: "camasir_makineleri", label: "Çamaşır makineleri", score: 37 },
    { value: "bulasik_makineleri", label: "Bulaşık makineleri", score: 35 },
    { value: "mikrodalga_firinlar", label: "Mikrodalga fırınlar", score: 32 },
    {
      value: "elektrikli_supurgeler",
      label: "Elektrikli süpürgeler",
      score: 30,
    },
    {
      value: "sac_kurutma_makineleri",
      label: "Saç kurutma makineleri",
      score: 27,
    },
    { value: "fotokopi_makineleri", label: "Fotokopi makineleri", score: 25 },
    { value: "faks_makineleri", label: "Faks makineleri", score: 22 },
    { value: "tarayicilar", label: "Tarayıcılar", score: 20 },
    { value: "projektorler", label: "Projektörler", score: 17 },
    {
      value: "televizyonlar",
      label: "Televizyonlar (CRT, LCD, LED, Plazma)",
      score: 45,
    },
    {
      value: "dvd_blu_ray_oynaticilar",
      label: "DVD/Blu-ray oynatıcılar",
      score: 42,
    },
    { value: "oyun_konsollari", label: "Oyun konsolları", score: 48 },
    {
      value: "ses_sistemleri",
      label: "Ses sistemleri ve hoparlörler",
      score: 40,
    },
    {
      value: "radyo_muzik_calarlar",
      label: "Radyo ve müzik çalarlar",
      score: 37,
    },
    { value: "floresan_lambalar", label: "Floresan lambalar", score: 35 },
    { value: "led_ampuller", label: "LED ampuller", score: 32 },
    {
      value: "diger_aydinlatma_ekipmanlari",
      label: "Diğer elektrikli aydınlatma ekipmanları",
      score: 30,
    },
    { value: "termometreler", label: "Termometreler", score: 27 },
    {
      value: "kan_basinci_monitörleri",
      label: "Kan basıncı monitörleri",
      score: 25,
    },
    { value: "sirnga_pompalari", label: "Şırınga pompaları", score: 22 },
    { value: "modemler", label: "Modemler", score: 20 },
    { value: "routerlar", label: "Routerlar", score: 17 },
    { value: "telefon_santralleri", label: "Telefon santralleri", score: 15 },
    { value: "antenler", label: "Antenler", score: 12 },
    { value: "kullanilmis_piller", label: "Kullanılmış piller", score: 10 },
    {
      value: "sarj_edilebilir_bataryalar",
      label: "Şarj edilebilir bataryalar",
      score: 7,
    },
    { value: "arac_akuleri", label: "Araç aküleri", score: 5 },
    {
      value: "elektrikli_oyuncaklar",
      label: "Elektrikli oyuncaklar",
      score: 2,
    },
    {
      value: "elektrikli_aletler",
      label: "Elektrikli aletler (matkaplar, testere vb.)",
      score: 25,
    },
    {
      value: "elektrikli_mutfak_aletleri",
      label: "Elektrikli mutfak aletleri (kahve makineleri, blender vb.)",
      score: 27,
    },
    { value: "elektronik_saatler", label: "Elektronik saatler", score: 30 },
  ];

  return (
    <div className={styles.profileContainer}>
      <div className={styles.profileHeader}>
        <img
          src={userProfile.profileImage}
          alt="Profile"
          className={styles.profileImage}
        />
        <h2>{userName || "Kullanıcı Adı"}</h2>{" "}
        {/* Display the name from Supabase */}
        <h3 className={styles.puan}>
          Puanım:<span>{totalScore}</span>
        </h3>
      </div>
      {showAlert && (
        <div className={`${styles.alert} ${styles[alertVariant]}`}>
          {alertMessage}
        </div>
      )}
      {isSelectVisible && (
        <div className={styles.profileCategory}>
          <h4>Bir veya birden fazla cihaz seçin:</h4>
          <div className={styles.optionsContainer}>
            {options.map((option, index) => (
              <div key={option.value} className={styles.optionItem}>
                <input
                  type="checkbox"
                  id={option.value}
                  value={option.value}
                  checked={selectedValues.includes(option.value)}
                  onChange={handleChange}
                />
                <label className="scrore" htmlFor={option.value}>
                  {option.label}
                  <span id={`score-${index}`}>( {option.score} Puan )</span>
                </label>
              </div>
            ))}
          </div>
          <div className={styles.dateInputContainer}>
            <h3>Randevu Başlangıç ve Bitiş Saatini Seçin</h3>
            <DatePicker
              selected={startDate}
              onChange={(date) => setStartDate(date)}
              showTimeSelect
              dateFormat="dd/MM/yyyy h:mm aa"
              placeholderText="Başlangıç Saati Seçin"
              timeIntervals={15}
              timeCaption="Saat"
              minDate={new Date()}
              className={styles.dateInput}
            />
            <DatePicker
              selected={endDate}
              onChange={(date) => setEndDate(date)}
              showTimeSelect
              dateFormat="dd/MM/yyyy h:mm aa"
              placeholderText="Bitiş Saati Seçin"
              timeIntervals={15}
              timeCaption="Saat"
              minDate={startDate || new Date()}
              className={styles.dateInput}
            />
          </div>
        </div>
      )}
      <button
        disabled={setIsBanned}
        className={styles.randevuButton}
        onClick={isSelectVisible ? handleRandevuOlustur : handleButtonClick}
      >
        {isSelectVisible ? "Randevu Oluştur" : "Randevu Oluşturmaya Başla"}
      </button>
    </div>
  );
};

export default withAuth(Home2);
