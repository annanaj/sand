import React from "react";
import { Button } from "./ui/button";

const clientId = "1361263425111720097"; // tvůj Client ID
const redirectUri = "http://localhost:5173/sand/callback"; // správná redirect URL

function DiscordLogin() {
  const authUrl = `https://discord.com/oauth2/authorize?client_id=${clientId}&redirect_uri=${redirectUri}&response_type=code&scope=identify email`;

  return (
    <div className="card-container items-center gap-2">
      <h2 className="title">Login with Discord</h2>
      <a href={authUrl}>
        <Button>Login with Discord</Button>
      </a>
    </div>
  );
}

export default DiscordLogin;
