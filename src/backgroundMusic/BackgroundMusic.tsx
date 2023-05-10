import React, { useState, useRef, useEffect } from 'react';
import { IoMusicalNotes, IoMusicalNotesOutline } from 'react-icons/io5';

interface BackgroundMusicProps {
    audioFile: string;
}

const BackgroundMusic: React.FC<BackgroundMusicProps> = ({ audioFile }) => {
    const [isMuted, setIsMuted] = useState(false);
    const [showVolumeSlider, setShowVolumeSlider] = useState(false);
    const [volume, setVolume] = useState(0.05);
    const audioRef = useRef<HTMLAudioElement | null>(null);
    const containerRef = useRef<HTMLDivElement | null>(null);

    const handleToggleMute = () => {
        setShowVolumeSlider(!showVolumeSlider);
    };

    const handleVolumeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const newVolume = parseFloat(event.target.value);
        if (audioRef.current) {
            audioRef.current.volume = newVolume;
            setIsMuted(newVolume === 0);
            setVolume(newVolume);
        }
    };

    const handleClickOutside = (event: MouseEvent) => {
        if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
            setShowVolumeSlider(false);
        }
    };

    useEffect(() => {
        if (audioRef.current) {
            audioRef.current.loop = true;
            audioRef.current.volume = volume;
            audioRef.current.play();
        }

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    return (
        <div ref={containerRef} style={{ display: 'inline-block', position: 'relative' }}>
            <audio ref={audioRef} src={audioFile} />
            <button onClick={handleToggleMute} style={{ background: 'none', border: 'none', cursor: 'pointer' }}>
                {isMuted ? <IoMusicalNotesOutline size={30} color="white" /> : <IoMusicalNotes size={30} color="white" />}
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
                        right: '40%',
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

export default BackgroundMusic;
