import React from "react";
import ReactDOM from "react-dom/client";
import "./App.css";
import MainPage from "./pages/MainPage";

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <MainPage />
  </React.StrictMode>,
);
