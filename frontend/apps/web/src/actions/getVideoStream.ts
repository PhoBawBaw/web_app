'use server'

import { getApiClient } from '@/lib/api'

export const getVideoStream = async () => {
    try {
        const apiClient = await getApiClient();
        const response = await apiClient.users.getVideoStreamUrl();

        if (!response || !response.body) {
            throw new Error('Failed to fetch video stream');
        }

        return response.body;
    } catch (error) {
        console.error('Failed to fetch video stream:', error);
        return null;
    }
}
