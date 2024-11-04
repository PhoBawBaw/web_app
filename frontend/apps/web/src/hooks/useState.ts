import { useState, useEffect } from 'react';

const useMoveData = () => {
    const [moveData, setMoveData] = useState<{ datetime: string; status: string }[]>([]);

    useEffect(() => {
        const fetchMoveData = async () => {
            try {
                const response = await fetch('http://<ip address>:58000/api/users/state-store/');
                if (response.ok) {
                    const data = await response.json();
                    setMoveData(data);
                } else {
                    console.error('Failed to fetch move data');
                }
            } catch (error) {
                console.error('Error fetching move data:', error);
            }
        };

        fetchMoveData();
    }, []);

    return moveData;
};

export default useMoveData;
