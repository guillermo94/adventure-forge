import React, { useState } from 'react';

interface LanguageSelectorProps {
    onLanguageChange: (language: string) => void;
}
const LanguageSelector: React.FC<LanguageSelectorProps> = ({ onLanguageChange }) => {
    const [selectedLanguage, setSelectedLanguage] = useState('en');

    const handleLanguageChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const newLanguage = e.target.value;
        setSelectedLanguage(newLanguage);
        onLanguageChange(newLanguage);
    };
    return (
        <>
            <label htmlFor="language">Elige el idioma del juego:</label>
            <select
                id="language"
                value={selectedLanguage}
                onChange={handleLanguageChange}
            >
                <option value="en">Inglés</option>
                <option value="es">Español</option>
            </select>
        </>
    );
};

export default LanguageSelector;
