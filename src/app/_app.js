import { useState } from "react"; // React'ı içe aktarın
import { AuthProvider } from "../context/AuthContext";
import Randevu from "./randevular/page";
import Home2 from "./home2/page";

function MyApp({ Component, pageProps }) {
  const [isBanned, setIsBanned] = useState(false);

  return (
    <AuthProvider>
      <Component {...pageProps} setIsBanned={setIsBanned} isBanned={isBanned} />
    </AuthProvider>
  );
}

export default MyApp;
