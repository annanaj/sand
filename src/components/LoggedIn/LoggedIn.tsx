import React from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useLocation } from "react-router-dom";

const LoggedIn = () => {
  // Můžeš použít useLocation pro získání uživatelských informací, pokud je předáváš jako state
  const location = useLocation();
  const userInfo = location.state?.userInfo;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="title">
          Jsem logged in přes Discord
        </CardTitle>
      </CardHeader>
      <CardContent>
        {userInfo ? (
          <div className="flex flex-col items-center justify-center">
            <p>a muj email je:</p>
            <p>{userInfo.email}</p>
          </div>
        ) : (
          <p>Načítání informací o uživatelském účtu...</p>
        )}
      </CardContent>
    </Card>
  );
};

export default LoggedIn;
