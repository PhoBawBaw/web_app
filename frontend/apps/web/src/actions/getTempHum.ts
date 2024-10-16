'use server'

import { getApiClient } from '@/lib/api'

export const getSensorData = async () => {
    try {
        const apiClient = await getApiClient()
        const response = await apiClient.users.getTemperatureHumidity()
        return {
            temperature: response.temperature,
            humidity: response.humidity,
            state: response.state,
        }
    } catch (error) {
        console.error('Failed to fetch sensor data:', error)
        return {
            temperature: null,
            humidity: null,
            state: null,
        }
    }
}