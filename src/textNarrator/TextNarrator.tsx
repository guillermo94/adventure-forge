import React, { useState, useRef, useEffect } from 'react';
import { FiVolume2, FiVolumeX } from 'react-icons/fi';

interface TextNarratorProps {
    text: string;
    voice: SpeechSynthesisVoice;
}

const TextNarrator: React.FC<TextNarratorProps> = ({ text, voice }) => {
    const [isMuted, setIsMuted] = useState(false);
    const [showVolumeSlider, setShowVolumeSlider] = useState(false);
    const [volume, setVolume] = useState(1);
    const containerRef = useRef<HTMLDivElement | null>(null);

    const splitTextIntoChunks = (text: string, maxChunkSize: number) => {
        const words = text.split(' ');
        const chunks = [];
        let currentChunk = '';

        words.forEach(word => {
            if (currentChunk.length + word.length <= maxChunkSize) {
                currentChunk += ' ' + word;

                // Si el último carácter de la palabra es un punto, crea un nuevo fragmento
                if (word.slice(-1) === '.') {
                    chunks.push(currentChunk.trim());
                    currentChunk = '';
                }
            } else {
                chunks.push(currentChunk.trim());
                currentChunk = word;
            }
        });

        if (currentChunk.length > 0) {
            chunks.push(currentChunk.trim());
        }

        return chunks;
    };

    const speak = (text: string, voice: SpeechSynthesisVoice, volume: number) => {
        // Limpiar el array de utterances
        window.utterances = [];
        speechSynthesis.cancel();
        // Dividir el texto en fragmentos, sin dividir las palabras a la mitad
        const maxChunkSize = 120;
        const textChunks = splitTextIntoChunks(text, maxChunkSize);

        // Función para hablar un fragmento y programar el siguiente fragmento
        const speakChunk = (index: number) => {
            if (index < textChunks.length) {
                const utterance = new SpeechSynthesisUtterance(textChunks[index]);
                utterance.voice = voice;
                utterance.volume = volume;
                window.utterances.push(utterance);

                utterance.onend = () => {
                    speakChunk(index + 1);
                };

                speechSynthesis.speak(utterance);
            }
        };

        // Iniciar la narración
        speakChunk(0);
    };
    const handleToggleMute = () => {
        if (showVolumeSlider) {
            setIsMuted(!isMuted);
            if (isMuted) {
                speechSynthesis.resume();
            } else {
                speechSynthesis.pause();
            }
        } else {
            setShowVolumeSlider(true);
        }
    };
    const handleClickOutside = (event: MouseEvent) => {
        if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
            setShowVolumeSlider(false);
        }
    };

    const handleVolumeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const newVolume = parseFloat(event.target.value);
        setVolume(newVolume);
        speechSynthesis.cancel();
        speak(text, voice, newVolume);
    };

    useEffect(() => {
        speak(text, voice, volume);

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            speechSynthesis.cancel();
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [text, voice, volume]);

    return (
        <div ref={containerRef} style={{ display: 'inline-block', position: 'relative' }}>
            <button onClick={handleToggleMute} style={{ background: 'none', border: 'none', cursor: 'pointer' }}>
                {isMuted ? <FiVolumeX color="white" size={35} /> : <FiVolume2 color="white" size={35} />}
            </button>
            {showVolumeSlider && (
                <input
                    type="range"
                    min="0"
                    max="1"
                    step="0.01"
                    value={volume}
                    onChange={handleVolumeChange}
                    style={{
                        position: 'absolute',
                        right: '45%',
                        bottom: 'calc(100% + 40px)', // Añadir un espacio entre el control deslizante y el ícono
                        width: '100px',
                        transform: 'translateX(50%) rotate(-90deg)', // Rotar el control deslizante en sentido contrario
                        cursor: 'pointer',
                        zIndex: 1000,
                    }}
                />
            )}
        </div>
    );
};

export default TextNarrator;