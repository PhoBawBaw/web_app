import { useEffect, useState } from 'react'

const useSensorData = () => {
    const [temperature, setTemperature] = useState<string | null>(null)
    const [humidity, setHumidity] = useState<string | null>(null)
    const [state, setState] = useState<string | null>(null)
    const [move_state, setMoveState] = useState<string | null>(null)

    useEffect(() => {
        const fetchSensorData = async () => {
            try {
                const response = await fetch('http://<ip address>:58000/api/users/temperature-humidity/')
                const response_status = await fetch('http://<ip address>:58000/api/users/baby-crying-status/')
                const response_move_status = await fetch('http://<ip address>:58000/api/users/moving-status/')

                const data = await response.json()
                const status_data = await response_status.json()
                const move_status_data = await response_move_status.json()

                if (response.ok) {
                    setTemperature(data.temperature)
                    setHumidity(data.humidity)
                    setState(status_data.state)
                    setMoveState(move_status_data.state)
                } else {
                    console.error('Failed to fetch sensor data:', data)
                }
            } catch (error) {
                console.error('Error fetching sensor data:', error)
            }
        }

        fetchSensorData()
        const intervalId = setInterval(fetchSensorData, 5000)
        return () => clearInterval(intervalId)
    }, [])

    return { temperature, humidity, state, move_state }
}

export default useSensorData