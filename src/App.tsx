import React, { useEffect } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useLocation,
} from "react-router-dom";
import ReactGA from "react-ga4";
// import * as Sentry from '@sentry/react';

import "./index.css";
import "./i18n";

import { Animations } from "./components/Animations/Animations";
import { EmailForm } from "./components/EmailForm/EmailForm";
import { Keyframes } from "./components/Keyframes/Keyframes";
import { Notification } from "./components/Notification/Notification";
import { Player } from "./components/Player/Player";
import { UsersList } from "./components/UsersList/UsersList";
import { ShopItem } from "./components/ShopItem/ShopItem";
import { HigherOrder } from "./components/HigherOrder/HigherOrder";
import { RepositoriesList } from "./components/RepositoriesList/RepositoriesList";
import { ThemeProvider } from "./components/ThemeProvider";
import { LanguageSwitcher } from "@/components/LanguageSwitcher/LanguageSwitcher";
import { ThemeSwitcher } from "@/components/ThemeSwitcher/ThemeSwitcher";

import DiscordLogin from "@/components/DiscordLogin";
import DiscordCallback from "@/components/DiscordCallback";
import LoggedIn from "@/components/LoggedIn/LoggedIn";

function HomePage() {
  const ShopItemWithCounter = HigherOrder(ShopItem);

  return (
    <>
      <div className="absolute top-2 right-2 flex flex-col gap-2">
        <LanguageSwitcher />
        <ThemeSwitcher />
      </div>
      <h1 className="title spacingTop font-black">
        Sandbox
      </h1>
      <div className="mainContainer">
        <DiscordLogin />
        <Notification />
        <Animations />
        <Keyframes />
        <UsersList />
        <EmailForm />
        <Player />
        <ShopItem />
        <ShopItemWithCounter />
        <RepositoriesList
          owners={[
            "bradfrost",
            "csswizardry",
            "gaearon",
            "LeaVerou",
          ]}
        />
      </div>
    </>
  );
}

function RouteTracker() {
  const location = useLocation();

  useEffect(() => {
    ReactGA.send({
      hitType: "pageview",
      page: location.pathname + location.search,
    });
  }, [location]);

  return null;
}

export default function App() {
  return (
    // <Sentry.ErrorBoundary>
    <ThemeProvider>
      <Router>
        <RouteTracker />
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/sand" element={<HomePage />} />
          <Route
            path="/sand/callback"
            element={<DiscordCallback />}
          />
          <Route
            path="/sand/logged"
            element={<LoggedIn />}
          />
        </Routes>
      </Router>
    </ThemeProvider>
    // </Sentry.ErrorBoundary>
  );
}
