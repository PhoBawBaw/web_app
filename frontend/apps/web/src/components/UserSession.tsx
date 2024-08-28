'use client'

import { useSession } from 'next-auth/react'
import { useEffect, useState } from 'react'
import { getSensorData } from '@/actions/getTempHum'
import { signIn, signOut } from 'next-auth/react'

const SignOutLink: React.FC = () => {
  return (
    <a
      onClick={() => signOut()}
      className="cursor-pointer text-purple-600 underline"
    >
      Logout
    </a>
  )
}

const UserSession: React.FC = () => {
  const { data: session, status } = useSession()

  const [temperature, setTemperature] = useState<string | null>(null)
  const [humidity, setHumidity] = useState<string | null>(null)
  const [state, setState] = useState<string | null>(null)
  const [loadingStream, setLoadingStream] = useState<boolean>(true)

  useEffect(() => {
    if (status === 'unauthenticated') {
      // Redirect to the sign-in page if not authenticated
      signIn()
    }

    if (status === 'authenticated') {
      const fetchSensorData = async () => {
        const data = await getSensorData()
        setTemperature(data.temperature)
        setHumidity(data.humidity)
        setState(data.state)
      }

      fetchSensorData()

      const intervalId = setInterval(fetchSensorData, 5000)

      return () => clearInterval(intervalId)
    }
  }, [status])

  return (
    <div className="relative">
      {status === 'authenticated' && (
        <div className="mt-8">
          <figure className="h-auto max-w-lg mx-auto relative max-w-sm transition-all duration-300 cursor-pointer filter grayscale hover:grayscale-0">
            <a href="#">
              <img
                src="http://localhost:8000/api/users/video-stream/"
                alt="Video Stream"
                className="h-auto max-w-lg mx-auto max-w-full transition-all duration-300 rounded-lg cursor-pointer filter grayscale hover:grayscale-0"
                onLoad={() => setLoadingStream(false)}
                onError={() => console.error('Failed to load video stream')}
              />
            </a>
            <figcaption className="absolute px-4 text-lg text-white bottom-6">
              <p>
                Temperature:{' '}
                <span className="font-bold">
                  {temperature ? temperature.toFixed(2) : 'Loading...'}
                </span>
                °C
              </p>
              <p>
                Humidity:{' '}
                <span className="font-bold">
                  {humidity ? humidity.toFixed(2) : 'Loading...'}
                </span>
                %
              </p>
              <p>
                BabyState:{' '}
                <span className="font-bold">{state || 'Loading...'}</span>
              </p>
              {/* <p>
                Temperature:{' '}
                <span className="font-bold">{temperature || 'Loading...'}</span>°C
              </p>
              <p>
                Humidity:{' '}
                <span className="font-bold">{humidity || 'Loading...'}</span>%
              </p>
              <p>
                BabyState:{' '}
                <span className="font-bold">{state || 'Loading...'}</span>
              </p> */}
            </figcaption>
          </figure>
        </div>
      )}
    </div>
  )
}

export default UserSession
