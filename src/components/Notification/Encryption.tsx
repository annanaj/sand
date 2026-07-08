import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { Button } from "../ui/button";

export function Encryption() {
  const { t } = useTranslation();
  const [input, setInput] = useState("");
  const [decryptedData, setDecryptedData] = useState("");

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement>,
  ) => {
    setInput(e.target.value);
  };

  // function to derive the encryption key from a password and a random salt (an extra security element)
  const getKey = async (salt: BufferSource) => {
    const password = "secret-key"; // hardcoded password
    const enc = new TextEncoder().encode(password);

    // create keyMaterial from the password
    const keyMaterial =
      await window.crypto.subtle.importKey(
        "raw",
        enc,
        { name: "PBKDF2" },
        false,
        ["deriveKey"],
      );

    // derive the encryption key using the salt
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

  // encrypt and store the data
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // generate a random IV and salt (must be different for every encryption)
    const iv = window.crypto.getRandomValues(
      new Uint8Array(12),
    );
    const salt = window.crypto.getRandomValues(
      new Uint8Array(16),
    );

    // get the encryption key from the password and the current salt
    const key = await getKey(salt);

    const encoder = new TextEncoder();
    const data = encoder.encode(input);

    // the actual encryption
    const encrypted = await window.crypto.subtle.encrypt(
      { name: "AES-GCM", iv },
      key,
      data,
    );

    // convert the encrypted data to base64 for storage
    const encryptedBase64 = btoa(
      String.fromCharCode(...new Uint8Array(encrypted)),
    );

    // store the data, IV and salt in localStorage
    localStorage.setItem("encryptedData", encryptedBase64);
    localStorage.setItem(
      "iv",
      JSON.stringify(Array.from(iv)),
    );
    localStorage.setItem(
      "salt",
      JSON.stringify(Array.from(salt)),
    );

    // clear the input
    setInput("");
  };

  // decrypt the stored data
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
      setDecryptedData(t("Encryption.decryptFailed"));
    }
  };

  return (
    <div className="flex flex-col items-center">
      <h2 className="title">{t("Encryption.title")}</h2>
      <form
        onSubmit={handleSubmit}
        className="flex gap-2 mb-2"
      >
        <input
          type="text"
          value={input}
          onChange={handleInputChange}
          placeholder={t("Encryption.placeholder")}
        />
        <Button type="submit">
          {t("Encryption.save")}
        </Button>
      </form>
      <div className="flex gap-2 items-center">
        <Button onClick={handleDecrypt}>
          {t("Encryption.decrypt")}
        </Button>
        {decryptedData && <p>{decryptedData}</p>}
      </div>
    </div>
  );
}
