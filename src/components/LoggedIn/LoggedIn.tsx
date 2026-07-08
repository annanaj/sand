import React from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useLocation } from "react-router-dom";

const LoggedIn = () => {
  // You can use useLocation to get the user info if you pass it as state
  const location = useLocation();
  const userInfo = location.state?.userInfo;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="title">
          I am logged in via Discord
        </CardTitle>
      </CardHeader>
      <CardContent>
        {userInfo ? (
          <div className="flex flex-col items-center justify-center">
            <p>and my email is:</p>
            <p>{userInfo.email}</p>
          </div>
        ) : (
          <p>Loading user account info...</p>
        )}
      </CardContent>
    </Card>
  );
};

export default LoggedIn;
