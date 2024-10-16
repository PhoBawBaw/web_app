import { useEffect, useState } from 'react'

const useVideos = () => {
    const [videos, setVideos] = useState<string[]>([])

    useEffect(() => {
        const fetchVideos = async () => {
            try {
                const response = await fetch('http://183.104.150.59:58000/api/users/stream-store')
                const data = await response.json()
                if (response.ok) {
                    setVideos(data.videos)
                } else {
                    console.error('Failed to fetch video list:', data)
                }
            } catch (error) {
                console.error('Error fetching video list:', error)
            }
        }

        fetchVideos()
        const intervalId = setInterval(fetchVideos, 5000)
        return () => clearInterval(intervalId)
    }, [])

    return videos
}

export default useVideos
