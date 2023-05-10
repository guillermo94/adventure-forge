import React from 'react';
import { ReactComponent as SpanishFlag } from '../resources/ES.svg'; // Reemplaza con la ruta correcta
import { ReactComponent as EnglishFlag } from '../resources/GB.svg'; // Reemplaza con la ruta correcta
import './LanguageSelector.css';

interface LanguageSelectorProps {
    onLanguageChange: (language: string) => void;
}

const LanguageSelector: React.FC<LanguageSelectorProps> = ({ onLanguageChange }) => {
    const [selectedLanguage, setSelectedLanguage] = React.useState('en');

    const handleLanguageChange = (newLanguage: string) => {
        setSelectedLanguage(newLanguage);
        onLanguageChange(newLanguage);
    };

    return (
        <>
            <p>Elige el idioma del juego:</p>
            <div className="language-selector">
                <div
                    onClick={() => handleLanguageChange('en')}
                    className={`flag ${selectedLanguage === 'en' ? 'selected' : ''}`}
                >
                    <EnglishFlag />
                </div>
                <div
                    onClick={() => handleLanguageChange('es')}
                    className={`flag ${selectedLanguage === 'es' ? 'selected' : ''}`}
                >
                    <SpanishFlag />
                </div>
            </div>
        </>
    );
};

export default LanguageSelector;