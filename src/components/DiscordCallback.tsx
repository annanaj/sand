import React, { useEffect, useRef, useState } from "react";
import axios from "axios";
import { useLocation, useNavigate } from "react-router-dom";

// pro zpracovani odpovědi od Discordu. Když uživatel klikne na tlačítko pro přihlášení
// a Discord ho přesměruje zpět na moji stránku (/discord/callback), ziskam autorizační kód.
// V této komponentě odeslu kód na muj backend pro výměnu za access token.
// Tato komponenta se aktivuje při přesměrování uživatele zpět
// na http://localhost:3000/discord/callback, získá autorizační kód, pošle ho
// na backend pro výměnu za přístupový token a následně získá informace
// o uživatelském účtu z Discordu

const DiscordCallback = () => {
  const [, setUserInfo] = useState(null);
  const [, setAccessToken] = useState(null);
  const hasFetched = useRef(false); // Flag pro zabránění opakovanému volání
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    if (hasFetched.current) return; // Pokud už jsme jednou volali, nevoláme znova
    hasFetched.current = true;

    const fetchToken = async () => {
      const queryParams = new URLSearchParams(
        location.search,
      );
      const code = queryParams.get("code");
      console.log("Code from URL:", code); // ✅ Ujisti se, že dostáváš kód

      try {
        // Pošli autorizační kód na backend
        const response = await axios.post(
          "http://localhost:3001/discord/callback",
          { code },
        );
        console.log(
          "Received data from backend:",
          response.data,
        ); // ✅ Zkontroluj, že dostáváš accessToken.

        const { accessToken } = response.data; // Destrukturalizuj accessToken z odpovědi

        if (!accessToken) {
          console.error("Access token not received!");
          return;
        }

        setAccessToken(accessToken); // Uložení access tokenu
        console.log("Access Token:", accessToken); // ✅ Ujisti se, že máš platný token

        // Zavoláme Discord API pro získání informací o uživatelském účtu
        const userResponse = await axios.get(
          "https://discord.com/api/v10/users/@me",
          {
            headers: {
              Authorization: `Bearer ${accessToken}`, // Pošleme Bearer token pro ověření
            },
          },
        );

        console.log("User info:", userResponse.data);
        setUserInfo(userResponse.data); // Ulož informace o uživatelském účtu

        // presmeruj na routu
        navigate("/sand/logged", {
          state: { userInfo: userResponse.data }, // Předání uživatelských informací
        });
      } catch (error) {
        console.error(
          "Error fetching access token:",
          error,
        );
      }
    };

    void fetchToken();
  }, [location, navigate]);

  return (
    <div>
      <h2>Logging in with Discord...</h2>
    </div>
  );
};

export default DiscordCallback;
