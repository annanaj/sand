import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import {
  RiDeleteBin5Line,
  RiEdit2Fill,
} from "react-icons/ri";

import { Button } from "@/components/ui/button";

import styles from "./UsersList.module.scss";

import {
  fetchUsers,
  createUser,
  updateUser,
  deleteUser,
} from "@/services/api";

type UsersList = {
  id: number;
  name: string;
  email: string;
};

export function UsersList() {
  const { t } = useTranslation();
  const [users, setUsers] = useState<UsersList[]>([]);
  const [newUser, setNewUser] = useState({
    name: "",
    email: "",
  });
  const [nameError, setNameError] = useState("");
  const [emailError, setEmailError] = useState("");
  const [editingUser, setEditingUser] =
    useState<UsersList | null>(null);
  const emailRegex =
    /^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$/;

  const fetchUsersData = async () => {
    try {
      const response = await fetchUsers();
      setUsers(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  const handleNameChange = (
    e: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const newValue = e.target.value;
    if (newValue.length < 3) {
      setNameError(t("UsersList.nameTooShort"));
    } else if (newValue.length > 20) {
      setNameError(t("UsersList.nameTooLong"));
    } else {
      setNameError("");
      // Check if editingUser is not null before updating
      if (editingUser) {
        setEditingUser({
          ...editingUser,
          name: newValue,
        });
      }
    }
  };

  const handleEmailChange = (
    e: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const newValue = e.target.value;
    if (!emailRegex.test(newValue)) {
      setEmailError(t("UsersList.invalidEmail"));
    } else {
      setEmailError("");
      // Check if editingUser is not null before updating
      if (editingUser) {
        setEditingUser({
          ...editingUser,
          email: newValue,
        });
      }
    }
  };

  const handleCreateUser = async (
    e: React.FormEvent<HTMLFormElement>,
  ) => {
    e.preventDefault();
    try {
      await createUser(newUser);
      fetchUsersData();
      setNewUser({ name: "", email: "" });
      setNameError("");
      setEmailError("");
    } catch (error) {
      console.error(error);
    }
  };

  const handleUpdateUser = async () => {
    if (editingUser) {
      if (
        !editingUser.name ||
        editingUser.name.trim().length < 3
      ) {
        setNameError(t("UsersList.nameTooShort"));
        return;
      } else if (editingUser.name.length > 20) {
        setNameError(t("UsersList.nameTooLong"));
        return;
      } else {
        setNameError("");
      }

      if (
        !editingUser.email ||
        !emailRegex.test(editingUser.email)
      ) {
        setEmailError(t("UsersList.invalidEmail"));
        return;
      } else {
        setEmailError("");
      }

      try {
        await updateUser(editingUser.id, editingUser);
        fetchUsersData();
        setEditingUser(null);
      } catch (error) {
        console.error(error);
      }
    }
  };

  const handleDeleteUser = async (id: number) => {
    try {
      await deleteUser(id);
      fetchUsersData();
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchUsersData();
  }, []);

  return (
    <div className="card-container items-center">
      <h2 className="title">{t("UsersList.title")}</h2>
      <form className="form" onSubmit={handleCreateUser}>
        <label
          htmlFor="fullName"
          className="visuallyHidden"
        >
          {t("UsersList.fullNameLabel")}
        </label>
        <input
          type="text"
          id="fullName"
          placeholder={t("UsersList.fullNamePlaceholder")}
          value={newUser.name}
          onChange={(e) =>
            setNewUser({
              ...newUser,
              name: e.target.value,
            })
          }
          minLength={3}
          maxLength={20}
          aria-required="true"
          aria-label={t("UsersList.fullNameLabel")}
          required
        />

        <label htmlFor="email" className="visuallyHidden">
          {t("UsersList.emailLabel")}
        </label>
        <input
          type="email"
          id="email"
          placeholder={t("UsersList.emailPlaceholder")}
          value={newUser.email}
          onChange={(e) =>
            setNewUser({
              ...newUser,
              email: e.target.value,
            })
          }
          aria-required="true"
          aria-invalid={!!emailError}
          aria-describedby="emailError"
          aria-label={t("UsersList.emailAriaLabel")}
          required
        />
        <Button
          type="submit"
          aria-label={t("UsersList.addUser")}
        >
          {t("UsersList.addUser")}
        </Button>
      </form>

      {editingUser && (
        <div className="form mt-4">
          <label
            htmlFor="nameEdit"
            className="visuallyHidden"
          >
            {t("UsersList.nameLabel")}
          </label>
          <input
            type="text"
            id="nameEdit"
            placeholder={t("UsersList.fullNamePlaceholder")}
            value={editingUser.name}
            onChange={handleNameChange}
            aria-required="true"
            aria-label={t("UsersList.fullNameLabel")}
          />
          {nameError && (
            <p className="error">{nameError}</p>
          )}

          <label
            htmlFor="emailEdit"
            className="visuallyHidden"
          >
            {t("UsersList.emailLabel")}
          </label>
          <input
            type="email"
            id="emailEdit"
            placeholder={t("UsersList.emailPlaceholder")}
            value={editingUser.email}
            onChange={handleEmailChange}
            aria-required="true"
            aria-invalid={!!emailError}
            aria-describedby="emailError"
            aria-label={t("UsersList.emailAriaLabel")}
          />
          {emailError && (
            <p className="error">{emailError}</p>
          )}

          <div className={styles.userButtons}>
            <button
              className="buttonSecondary"
              onClick={() => {
                setEditingUser(null);
                setNameError("");
                setEmailError("");
              }}
            >
              {t("UsersList.cancel")}
            </button>
            <button onClick={handleUpdateUser}>
              {t("UsersList.update")}
            </button>
          </div>
        </div>
      )}

      <ul className={styles.usersList}>
        {users.map((user) => (
          <li className={styles.userRow} key={user.id}>
            <span className={styles.userInfo}>
              {user.name} - {user.email}
            </span>
            <div className={styles.userButtons}>
              <button
                className="buttonTransparent"
                aria-label={t("UsersList.editUser")}
                onClick={() => setEditingUser(user)}
              >
                <RiEdit2Fill />
              </button>
              <button
                className="buttonTransparent"
                aria-label={t("UsersList.deleteUser")}
                onClick={() => handleDeleteUser(user.id)}
              >
                <RiDeleteBin5Line />
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
