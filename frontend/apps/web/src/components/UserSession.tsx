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

  const [videos, setVideos] = useState<string[]>([])
  const [selectedVideo, setSelectedVideo] = useState<string | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [showAlert, setShowAlert] = useState(false);

  useEffect(() => {
    if (state !== 'Don’t_know' && state) {
      setShowAlert(true);

      const timer = setTimeout(() => {
        setShowAlert(false);
      }, 3000);

      return () => clearTimeout(timer);
    }
  }, [state]);


  useEffect(() => {
    if (status === 'unauthenticated') {
      signIn()
    }

    if (status === 'authenticated') {
      const fetchSensorData = async () => {
        try {
          const response = await fetch('http://183.104.150.59:58000/api/users/temperature-humidity/');
          const response_status = await fetch('http://183.104.150.59:58000/api/users/baby-crying-status/');
          const data = await response.json();
          const status_data = await response_status.json();

          if (response.ok) {
            setTemperature(data.temperature);
            setHumidity(data.humidity);
            setState(status_data.state);
          } else {
            console.error('Failed to fetch sensor data:', data);
          }
        } catch (error) {
          console.error('Error fetching sensor data:', error);
        }
      };

      fetchSensorData();

      const intervalId = setInterval(fetchSensorData, 5000);
      return () => clearInterval(intervalId);
    }
  }, [status]);


  useEffect(() => {
    if (status === 'authenticated') {
      const fetchVideos = async () => {
        try {
          const response = await fetch('http://183.104.150.59:58000/api/users/stream-store');
          const data = await response.json();
          if (response.ok) {
            setVideos(data.videos);
          } else {
            console.error('Failed to fetch video list:', data);
          }
        } catch (error) {
          console.error('Error fetching video list:', error);
        }
      };

      fetchVideos();
    }
  }, [status]);


  const openModal = (videoUrl: string) => {
    setSelectedVideo(videoUrl);
    setIsModalOpen(true);
  }


  const closeModal = () => {
    setSelectedVideo(null);
    setIsModalOpen(false);
  }


  useEffect(() => {
    if (status === 'authenticated' && videoRef.current) {
      const video = videoRef.current;

      if (Hls.isSupported()) {
        const hls = new Hls();
        hls.loadSource('http://183.104.150.59:58000/api/users/stream/stream.m3u8');
        hls.attachMedia(video);

        let movedToLastSegment = false;

        hls.on(Hls.Events.MANIFEST_PARSED, () => {
          video.play();

          if (!movedToLastSegment) {
            movedToLastSegment = true;
          }
        });

        hls.on(Hls.Events.ERROR, (event, data) => {
          console.error('HLS error:', data);
        });
      } else if (video.canPlayType('application/vnd.apple.mpegurl')) {
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
        <div className="mt-8 grid grid-cols-3 gap-4">

          <div className="col-span-2">
            <figure className="">
              <a href="#">
                <video
                  ref={videoRef}
                  id="video"
                  width="1280"
                  height="720"
                  controls
                  autoPlay
                  muted
                  className="rounded-lg"
                />
              </a>
              <figcaption className="absolute px-4 text-lg text-black bottom-30">
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
                  <span className="font-bold">
                  {state === 'Don’t_know' ? 'Idle' : state || 'Loading...'}
                  </span>
              </p>
              </figcaption>
            </figure>
          </div>

          {showAlert && (
            <div className="absolute left-4 bottom-4 bg-red-500 text-white font-bold px-4 py-2 rounded-lg shadow-lg">
              State: {state}
            </div>
          )}

          <div className="col-span-1">
            <div className="bg-gray-100 h-full overflow-y-auto p-4 rounded-lg shadow-lg">
              <h2 className="text-lg font-bold mb-4">Video List</h2>
              <ul>
                {videos.map((videoUrl, index) => {
                  const videoName = videoUrl.split('/').pop();
                  return (
                    <li key={index} className="mb-2">
                      <a
                        href="#"
                        className="text-blue-500 hover:underline"
                        onClick={() => openModal(videoUrl)}
                      >
                        {videoName}
                      </a>
                    </li>
                  )
                })}
              </ul>
            </div>
          </div>
        </div>
      )}


      {isModalOpen && selectedVideo && (
        <div className="fixed inset-0 bg-gray-800 bg-opacity-75 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg p-6 relative w-3/4 h-3/4">
            <button
              onClick={closeModal}
              className="absolute top-2 right-2 text-gray-600 hover:text-gray-800"
            >
              Close
            </button>
            <video
              src={selectedVideo}
              controls
              autoPlay
              className="rounded-lg w-full h-full"
            />
          </div>
        </div>
      )}

      {status === 'authenticated' && (
        <div className="mt-4 text-center">
          <SignOutLink />
        </div>
      )}
    </div>
  )
}

export default UserSession
