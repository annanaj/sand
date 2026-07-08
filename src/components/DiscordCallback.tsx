import { useEffect, useRef, useState } from "react";
import axios from "axios";
import { useTranslation } from "react-i18next";
import { useLocation, useNavigate } from "react-router-dom";

// Handles the response from Discord. When the user clicks the login button
// and Discord redirects them back to my page (/discord/callback), I get an authorization code.
// In this component I send the code to my backend to exchange it for an access token.
// This component activates when the user is redirected back
// to http://localhost:3000/discord/callback, gets the authorization code, sends it
// to the backend to exchange it for an access token, and then fetches
// the user account info from Discord.

const DiscordCallback = () => {
  const { t } = useTranslation();
  const [, setUserInfo] = useState(null);
  const [, setAccessToken] = useState(null);
  const hasFetched = useRef(false); // Flag to prevent repeated calls
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    if (hasFetched.current) return; // If we already called once, do not call again
    hasFetched.current = true;

    const fetchToken = async () => {
      const queryParams = new URLSearchParams(
        location.search,
      );
      const code = queryParams.get("code");
      console.log("Code from URL:", code); // ✅ Make sure you receive the code

      try {
        // Send the authorization code to the backend
        const response = await axios.post(
          "http://localhost:3001/discord/callback",
          { code },
        );
        console.log(
          "Received data from backend:",
          response.data,
        ); // ✅ Check that you receive the accessToken.

        const { accessToken } = response.data; // Destructure accessToken from the response

        if (!accessToken) {
          console.error("Access token not received!");
          return;
        }

        setAccessToken(accessToken); // Store the access token
        console.log("Access Token:", accessToken); // ✅ Make sure you have a valid token

        // Call the Discord API to get the user account info
        const userResponse = await axios.get(
          "https://discord.com/api/v10/users/@me",
          {
            headers: {
              Authorization: `Bearer ${accessToken}`, // Send the Bearer token for verification
            },
          },
        );

        console.log("User info:", userResponse.data);
        setUserInfo(userResponse.data); // Store the user account info

        // redirect to the route
        navigate("/sand/logged", {
          state: { userInfo: userResponse.data }, // Pass along the user info
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
      <h2>{t("DiscordCallback.loggingIn")}</h2>
    </div>
  );
};

export default DiscordCallback;
