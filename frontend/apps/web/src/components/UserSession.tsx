'use client'

import { useSession } from 'next-auth/react'
import { useEffect, useState, useRef } from 'react'
import { signIn, signOut } from 'next-auth/react'
import Hls from 'hls.js'

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
  const videoRef = useRef<HTMLVideoElement | null>(null)

  // Fetch temperature and humidity data
  useEffect(() => {
    if (status === 'unauthenticated') {
      signIn() // Redirect to the sign-in page if unauthenticated
    }

    if (status === 'authenticated') {
      const fetchSensorData = async () => {
        try {
          const response = await fetch('http://183.104.150.59:58000/api/users/temperature-humidity/');
          const data = await response.json();

          if (response.ok) {
            setTemperature(data.temperature);
            setHumidity(data.humidity);
            setState(data.state);
          } else {
            console.error('Failed to fetch sensor data:', data);
          }
        } catch (error) {
          console.error('Error fetching sensor data:', error);
        }
      };

      fetchSensorData(); // Fetch data once on load

      const intervalId = setInterval(fetchSensorData, 5000); // Poll every 5 seconds
      return () => clearInterval(intervalId); // Cleanup interval on unmount
    }
  }, [status]);

  // HLS video streaming setup
  useEffect(() => {
    if (status === 'authenticated' && videoRef.current) {
      const video = videoRef.current;

      if (Hls.isSupported()) {
        const hls = new Hls();
        hls.loadSource('http://183.104.150.59:58000/api/users/stream/stream.m3u8'); // m3u8 URL 수정
        hls.attachMedia(video);
        hls.on(Hls.Events.MANIFEST_PARSED, () => {
          video.play();
        });

        hls.on(Hls.Events.ERROR, (event, data) => {
          console.error('HLS error:', data);
        });
      } else if (video.canPlayType('application/vnd.apple.mpegurl')) {
        // For Safari or native HLS support
        video.src = 'http://183.104.150.59:58000/api/users/stream/stream.m3u8';
        video.addEventListener('loadedmetadata', () => {
          video.play();
        });
      }
    }
  }, [status]);

  return (
    <div className="relative">
      {status === 'authenticated' && (
        <div className="mt-8">
          <figure className="h-auto max-w-lg mx-auto relative max-w-sm transition-all duration-300 cursor-pointer filter grayscale hover:grayscale-0">
            <a href="#">
              <video
                ref={videoRef}
                id="video"
                width="640"
                height="480"
                controls
                autoplay="autoplay"
                muted="muted"
                className="rounded-lg"
              />
            </a>
            <figcaption className="absolute px-4 text-lg text-white bottom-6">
              <p>
                Temperature:{' '}
                <span className="font-bold">
                  {temperature ? parseFloat(temperature).toFixed(2) : 'Loading...'}
                </span>
                °C
              </p>
              <p>
                Humidity:{' '}
                <span className="font-bold">
                  {humidity ? parseFloat(humidity).toFixed(2) : 'Loading...'}
                </span>
                %
              </p>
              <p>
                BabyState:{' '}
                <span className="font-bold">{state || 'Loading...'}</span>
              </p>
            </figcaption>
          </figure>
          <div className="mt-4 text-center">
            <SignOutLink />
          </div>
        </div>
      )}
    </div>
  )
}

export default UserSession
