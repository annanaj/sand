import React, { useState } from "react";
import { Button } from "../ui/button";

export function Encryption() {
  const [input, setInput] = useState("");
  const [decryptedData, setDecryptedData] = useState("");

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement>,
  ) => {
    setInput(e.target.value);
  };

  // funkce pro získání šifrovacího klíče z hesla a náhodného saltu (dalsi bezpečnostní prvek)
  const getKey = async (salt: Uint8Array) => {
    const password = "secret-key"; // pevně zadané heslo
    const enc = new TextEncoder().encode(password);

    // vytvoření keyMaterial z hesla
    const keyMaterial =
      await window.crypto.subtle.importKey(
        "raw",
        enc,
        { name: "PBKDF2" },
        false,
        ["deriveKey"],
      );

    // derivace šifrovacího klíče pomocí salt
    return await window.crypto.subtle.deriveKey(
      {
        name: "PBKDF2",
        salt: salt,
        iterations: 100000,
        hash: "SHA-256",
      },
      keyMaterial,
      { name: "AES-GCM", length: 256 },
      true,
      ["encrypt", "decrypt"],
    );
  };

  // šifrování a uložení dat
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // vygenerujeme náhodné IV a salt (musí být jiné pro každé šifrování)
    const iv = window.crypto.getRandomValues(
      new Uint8Array(12),
    );
    const salt = window.crypto.getRandomValues(
      new Uint8Array(16),
    );

    // získáme šifrovací klíč z hesla a aktuálního saltu
    const key = await getKey(salt);

    const encoder = new TextEncoder();
    const data = encoder.encode(input);

    // samotné šifrování
    const encrypted = await window.crypto.subtle.encrypt(
      { name: "AES-GCM", iv },
      key,
      data,
    );

    // převedeme zašifrovaná data na base64 pro uložení
    const encryptedBase64 = btoa(
      // @ts-expect-error: Uint8Array spread vyžaduje --downlevelIteration
      String.fromCharCode(...new Uint8Array(encrypted)),
    );

    // uložíme data, IV a salt do localStorage
    localStorage.setItem("encryptedData", encryptedBase64);
    localStorage.setItem(
      "iv",
      JSON.stringify(Array.from(iv)),
    );
    localStorage.setItem(
      "salt",
      JSON.stringify(Array.from(salt)),
    );

    // vyčistíme vstup
    setInput("");
  };

  // dešifrování uložených dat
  const handleDecrypt = async () => {
    const encryptedBase64 =
      localStorage.getItem("encryptedData");
    const storedIV = localStorage.getItem("iv");
    const storedSalt = localStorage.getItem("salt");

    if (!encryptedBase64 || !storedIV || !storedSalt)
      return;

    const encryptedBytes = Uint8Array.from(
      atob(encryptedBase64),
      (c) => c.charCodeAt(0),
    );

    const iv = new Uint8Array(JSON.parse(storedIV));
    const salt = new Uint8Array(JSON.parse(storedSalt));
    const key = await getKey(salt);

    try {
      const decrypted = await window.crypto.subtle.decrypt(
        { name: "AES-GCM", iv },
        key,
        encryptedBytes,
      );
      const decoded = new TextDecoder().decode(decrypted);
      setDecryptedData(decoded);
    } catch (err) {
      console.error("Decryption failed:", err);
      setDecryptedData("Failed to decrypt.");
    }
  };

  return (
    <div className="flex flex-col items-center">
      <h2 className="title">Encryption</h2>
      <form
        onSubmit={handleSubmit}
        className="flex gap-2 mb-2"
      >
        <input
          type="text"
          value={input}
          onChange={handleInputChange}
          placeholder="Type message"
        />
        <Button type="submit">Save</Button>
      </form>
      <div className="flex gap-2 items-center">
        <Button onClick={handleDecrypt}>Decrypt</Button>
        {decryptedData && <p>{decryptedData}</p>}
      </div>
    </div>
  );
}
