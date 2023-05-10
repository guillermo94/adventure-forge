declare global {
    interface Window {
        utterances: SpeechSynthesisUtterance[];
    }
}

// Esto es necesario para que el archivo sea tratado como un módulo de declaración global
export { };
