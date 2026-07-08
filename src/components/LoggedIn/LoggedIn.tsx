import React from "react";
import { useTranslation } from "react-i18next";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useLocation } from "react-router-dom";

const LoggedIn = () => {
  const { t } = useTranslation();
  // You can use useLocation to get the user info if you pass it as state
  const location = useLocation();
  const userInfo = location.state?.userInfo;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="title">
          {t("LoggedIn.title")}
        </CardTitle>
      </CardHeader>
      <CardContent>
        {userInfo ? (
          <div className="flex flex-col items-center justify-center">
            <p>{t("LoggedIn.email")}</p>
            <p>{userInfo.email}</p>
          </div>
        ) : (
          <p>{t("LoggedIn.loading")}</p>
        )}
      </CardContent>
    </Card>
  );
};

export default LoggedIn;
