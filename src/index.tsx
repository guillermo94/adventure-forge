import React from "react";
import ReactDOM from "react-dom";
import { LanguageProvider } from "./language/LanguageContext";
import StartScreen from "./startScreen/StartScreen";

ReactDOM.render(
  <React.StrictMode>
    <LanguageProvider>
      <StartScreen />
    </LanguageProvider>
  </React.StrictMode>,
  document.getElementById("game-layout")
);