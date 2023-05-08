import React, { useRef, useEffect, useState } from "react";
import Game from "../game/Game";
import { useTranslation } from "../language/LanguageContext";
import LanguageSelector from "../language/LanguageSelector";

const StartScreen = (): React.ReactElement => {
    const [gameStarted, setGameStarted] = useState(false);
    const [userToken, setUserToken] = useState("");
    const { t, setLanguage } = useTranslation();

    function handleTokenChange(event: React.ChangeEvent<HTMLInputElement>) {
        setUserToken(event.target.value);
    }
    function handleTokenSubmit(event: React.FormEvent) {
        event.preventDefault();
        setGameStarted(true);
    }
    return (
        <div className="App">
            <h1>{t("welcome")}</h1>
            {!gameStarted ? (
                <div className="token-form">
                    <h1>Ingrese su token de API de OpenAI</h1>
                    <form onSubmit={handleTokenSubmit}>
                        <input
                            type="text"
                            value={userToken}
                            onChange={handleTokenChange}
                            placeholder="Ingrese su token aquí"
                            required
                        />
                        <button type="submit">{t("play")}</button>
                    </form>
                    <LanguageSelector onLanguageChange={setLanguage} />
                </div>
            ) : (
                <Game userToken={userToken} />
            )}
        </div>
    );
};

export default StartScreen;
