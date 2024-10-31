import { useState, useEffect } from 'react';

const useAudio = () => {
    const [audios, setAudios] = useState<string[]>([]);

    useEffect(() => {
        const fetchAudios = async () => {
            try {
                const response = await fetch('http://<ip address>:58000/api/users/audio-store/');
                if (response.ok) {
                    const data = await response.json();
                    setAudios(data.audios); // Use data.audios to access the array of URLs
                } else {
                    console.error('Failed to fetch audio files');
                }
            } catch (error) {
                console.error('Error fetching audio files:', error);
            }
        };

        fetchAudios();
    }, []);

    return audios;
};

export default useAudio;
