'use client'

import { useSession } from 'next-auth/react'
import { useEffect, useRef, useState } from 'react'
import { signIn, signOut } from 'next-auth/react'
import Hls from 'hls.js'
import useSensorData from '../hooks/useSensorData'
import useVideos from '../hooks/useVideos'
import useAlert from '../hooks/useAlert'


const SignOutLink: React.FC = () => {
  return (
    <button
      onClick={() => signOut()}
      className="bg-[#0191DA] text-white font-semibold py-2 px-4 rounded-lg shadow-md hover:bg-[#007BB5] transition duration-300 ease-in-out"
    >
      Logout
    </button>
  )
}


const UserSession: React.FC = () => {
  const { data: session, status } = useSession()
  const { temperature, humidity, state, move_state } = useSensorData()
  const videos = useVideos()
  const showAlert = useAlert(state)
  const videoRef = useRef<HTMLVideoElement | null>(null)

  const [selectedVideo, setSelectedVideo] = useState<string | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)

  useEffect(() => {
    if (status === 'authenticated' && videoRef.current) {
      const video = videoRef.current

      if (Hls.isSupported()) {
        const hls = new Hls()
        hls.loadSource('http://183.104.150.59:58000/api/users/stream/stream.m3u8')
        hls.attachMedia(video)

        let movedToLastSegment = false

        hls.on(Hls.Events.MANIFEST_PARSED, () => {
          video.play()

          if (!movedToLastSegment) {
            movedToLastSegment = true
          }
        })

        hls.on(Hls.Events.ERROR, (event, data) => {
          console.error('HLS error:', data)
        })
      } else if (video.canPlayType('application/vnd.apple.mpegurl')) {
        video.src = 'http://183.104.150.59:58000/api/users/stream/stream.m3u8'
        video.addEventListener('loadedmetadata', () => {
          video.play()
        })
      }
    }
  }, [status])

  const openModal = (videoUrl: string) => {
    setSelectedVideo(videoUrl)
    setIsModalOpen(true)
  }

  const closeModal = () => {
    setSelectedVideo(null)
    setIsModalOpen(false)
  }

  return (
    <div className="relative">
      <div className="flex justify-between items-start mb-2">
        <img src="/logo.png" alt="Logo" className="w-60 h-30" />
        {status === 'authenticated' && (
          <div className="mt-4 text-center">
            <SignOutLink />
          </div>
        )}
      </div>

      {status === 'authenticated' && (
        <div className="grid-rows-2 gap-4">
          <div className="grid grid-cols-3 gap-4">
            <div className="bg-white p-2 rounded-lg shadow-lg text-center">
              <h3 className="text-sm font-medium text-gray-500">습도</h3>
              <p className="text-2xl font-bold text-gray-900">{humidity ? parseFloat(humidity).toFixed(2) : 'Loading...'}</p>
              <div className="w-full bg-gray-200 rounded-full h-2.5 mt-2">
                <div className="bg-blue-600 h-2.5 rounded-full" style={{ width: humidity ? `${parseFloat(humidity).toFixed(2)}%` : '0%' }}></div>
              </div>
            </div>
            <div className="bg-white p-2 rounded-lg shadow-lg text-center">
              <h3 className="text-sm font-medium text-gray-500">온도</h3>
              <p className="text-2xl font-bold text-gray-900">{temperature ? parseFloat(temperature).toFixed(2) : 'Loading...'}</p>
              <div className="w-full bg-gray-200 rounded-full h-2.5 mt-2">
                <div className="bg-red-600 h-2.5 rounded-full" style={{ width: temperature ? `${(parseFloat(temperature) * 2.5).toFixed(2)}%` : '0%' }}></div>
              </div>
            </div>
            <div className="bg-white p-2 rounded-lg shadow-lg text-center">
              <h3 className="text-sm font-medium text-gray-500">울음 상태</h3>
              <p className="text-2xl font-bold text-gray-900">{state === 'Don’t_know' ? 'Idle' : state || 'Loading...'}</p>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4 mt-4">
            <div className="col-span-2">
              <figure className="">
                <a href="#">
                  <video
                    ref={videoRef}
                    id="video"
                    // width="1280"
                    // height="720"
                    controls
                    autoPlay
                    muted
                    className="rounded-lg w-full h-full"
                  />
                </a>
              </figure>
            </div>


            <div className="col-span-1">
              <div
                className="bg-gray-100 h-full overflow-y-auto p-4 rounded-lg shadow-lg"
                style={{ maxHeight: '580px' }}
              >
                <h2 className="text-lg font-bold mb-4">Video List</h2>
                <ul>
                  {videos.map((videoUrl, index) => {
                    const videoName = videoUrl.split('/').pop()
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

          {showAlert && (
            <div className="absolute left-4 bottom-4 bg-red-500 text-white font-bold px-4 py-2 rounded-lg shadow-lg">
              State: {state}
            </div>
          )}
        </div>
      )}

      {isModalOpen && selectedVideo && (
        <div className="fixed inset-0 bg-gray-800 bg-opacity-75 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg p-6 relative w-3/4 h-3/4">
            <button
              onClick={closeModal}
              className="bg-[#0191DA] text-white font-semibold py-1 px-2 rounded-md shadow-md hover:bg-[#007BB5] transition duration-300 ease-in-out"
            >
              Close
            </button>
            <video
              src={selectedVideo}
              autoPlay
              controls
              className="rounded-lg w-full h-full show-controls"
            />
          </div>
        </div>
      )}

    </div>

  )
}


export default UserSession