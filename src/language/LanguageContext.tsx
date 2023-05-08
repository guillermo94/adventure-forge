import { createContext, useContext, useState, useEffect } from 'react';
import translations from '../utils/translations';

const LanguageContext = createContext<{
    language: string;
    setLanguage: React.Dispatch<React.SetStateAction<string>>;
}>({
    language: 'en',
    setLanguage: () => { },
});

export const useLanguage = () => useContext(LanguageContext);

export const LanguageProvider: React.FC<React.PropsWithChildren<{}>> = ({ children }) => {
    const [language, setLanguage] = useState('en');
    return (
        <LanguageContext.Provider value={{ language, setLanguage }}>
            {children}
        </LanguageContext.Provider>
    );
};

// Crea un hook personalizado llamado "useTranslation"
export function useTranslation() {
    const { language, setLanguage } = useContext(LanguageContext);
    const [currentTranslations, setCurrentTranslations] = useState(translations[language]);

    useEffect(() => {
        setCurrentTranslations(translations[language]);
    }, [language]);

    const t = (key: string, variables?: { [key: string]: any }) => {
        let text = currentTranslations[key] || key;

        if (variables) {
            for (const variable in variables) {
                text = text.replace(`{${variable}}`, variables[variable]);
            }
        }

        return text;
    };

    return {
        t,
        setLanguage,
    };
}
