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
    <span
      onClick={() => signOut()}
      className="text-gray-700 font-semibold cursor-pointer hover:text-black transition duration-300 ease-in-out"
    >
      로그아웃
    </span>
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

  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  useEffect(() => {
    if (status === 'authenticated' && videoRef.current) {
      const video = videoRef.current

      if (Hls.isSupported()) {
        const hls = new Hls()
        hls.loadSource('http://<ip address>:58000/api/users/stream/stream.m3u8')
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
        video.src = 'http://<ip address>:58000/api/users/stream/stream.m3u8'
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
      <div className="flex flex-col  mb-2">
        {/* <img src="/logo.png" alt="Logo" className="w-60 h-30" /> */}
        <div className="flex justify-between items-center p-4 mb-2">
          {/* Left side (Monitoring text) */}
          <div
            className="text-left cursor-pointer"
            onClick={() => (window.location.href = '/')}
          >
            <h1 className="text-2xl font-semibold text-white">Welcome</h1>
            <p className="text-sm text-[#EDE9E9]">당신의 자녀를 실시간으로 모니터링하세요!</p>
          </div>
          {/* Right side (Menu icon) */}
          <div>
            <button onClick={toggleSidebar} className="text-white">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
            </button>
          </div>
        </div>

        {/* Sidebar */}
        <div
          className={`fixed top-0 right-0 h-full bg-white w-64 shadow-lg transform ${isSidebarOpen ? 'translate-x-0' : 'translate-x-full'
            } transition-transform duration-300 ease-in-out`}
          style={{ zIndex: 10 }}
        >
          <div className="p-4">
            <br></br>
            <br></br>
            <div className="flex items-center space-x-3 ">
              {/* Avatar */}
              <div className="flex items-center justify-center w-10 h-10 bg-teal-100 rounded-full">
                {/* This is a placeholder icon. Replace with an actual image or SVG if needed */}
                {/* <span className="text-xl">👔</span> */}
                <img
                  className="w-6 h-6 top-6 left-0.5 object-cover"
                  alt="Free icon bussiness"
                  src="https://c.animaapp.com/Sti7WLph/img/free-icon-bussiness-man-3048116-1@2x.png"
                />
              </div>

              {/* Name and Email */}
              <div>
                <div className="text-lg font-semibold text-gray-800">데모 사용자</div>
                <div className="text-sm text-gray-500">demo@phobawbaw.com</div>
              </div>
            </div>
            <br></br>
            <br></br>
            {/* <h2 className="text-lg font-semibold">Sidebar Menu</h2> */}
            <ul className="mt-4">
              <li className="mb-2"></li>
              <li>
                <a href="/video-list" className="flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group">
                  {/* <svg className="flex-shrink-0 w-5 h-5 text-gray-500 transition duration-75 dark:text-gray-400 group-hover:text-black dark:group-hover:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 20">
                    <path d="m17.418 3.623-.018-.008a6.713 6.713 0 0 0-2.4-.569V2h1a1 1 0 1 0 0-2h-2a1 1 0 0 0-1 1v2H9.89A6.977 6.977 0 0 1 12 8v5h-2V8A5 5 0 1 0 0 8v6a1 1 0 0 0 1 1h8v4a1 1 0 0 0 1 1h2a1 1 0 0 0 1-1v-4h6a1 1 0 0 0 1-1V8a5 5 0 0 0-2.582-4.377ZM6 12H4a1 1 0 0 1 0-2h2a1 1 0 0 1 0 2Z" />
                  </svg> */}
                  <img
                    className="w-[26px] h-6 top-[61px] left-[17px] object-cover"
                    alt="Baby"
                    src="https://c.animaapp.com/Sti7WLph/img/baby-1@2x.png"
                  />
                  <span className="flex-1 ms-3 whitespace-nowrap text-gray-700">녹화 영상</span>
                </a>
              </li>
              {/* {showVideoList && <VideoList />} */}
              <li>
                <a href="/sleep-pattern" className="flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group">
                  {/* <svg className="flex-shrink-0 w-5 h-5 text-gray-500 transition duration-75 dark:text-gray-400 group-hover:text-black dark:group-hover:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 18">
                    <path d="M14 2a3.963 3.963 0 0 0-1.4.267 6.439 6.439 0 0 1-1.331 6.638A4 4 0 1 0 14 2Zm1 9h-1.264A6.957 6.957 0 0 1 15 15v2a2.97 2.97 0 0 1-.184 1H19a1 1 0 0 0 1-1v-1a5.006 5.006 0 0 0-5-5ZM6.5 9a4.5 4.5 0 1 0 0-9 4.5 4.5 0 0 0 0 9ZM8 10H5a5.006 5.006 0 0 0-5 5v2a1 1 0 0 0 1 1h11a1 1 0 0 0 1-1v-2a5.006 5.006 0 0 0-5-5Z" />
                  </svg> */}
                  <img
                    className="w-[26px] h-[25px] top-[9px] left-[18px] object-cover"
                    alt="Baby sleep"
                    src="https://c.animaapp.com/Sti7WLph/img/baby-sleep-2@2x.png"
                  />
                  <span className="flex-1 ms-3 whitespace-nowrap text-gray-700">수면 패턴</span>
                </a>
              </li>

              <ul className="pt-4 mt-4 space-y-2 font-medium border-t border-gray-200 dark:border-gray-700">
                <li>
                  <a href="#" className="flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group">
                    <svg className="flex-shrink-0 w-5 h-5 text-gray-500 transition duration-75 dark:text-gray-400 group-hover:text-black dark:group-hover:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 18 16">
                      <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M1 8h11m0 0L8 4m4 4-4 4m4-11h3a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2h-3" />
                    </svg>
                    {status === 'authenticated' && (
                      <span className="flex-1 ms-3 whitespace-nowrap"><SignOutLink /></span>
                    )}
                  </a>
                </li>
              </ul>
            </ul>

            <button onClick={toggleSidebar} data-drawer-hide="drawer-navigation" aria-controls="drawer-navigation" class="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm p-1.5 absolute top-2.5 end-2.5 inline-flex items-center dark:hover:bg-gray-600 dark:hover:text-white" >
              <svg aria-hidden="true" className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd"></path></svg>
              <span className="sr-only">Close menu</span>
            </button>
          </div>
        </div>
      </div>


      <div className="mt-4 w-full h-64 rounded-lg overflow-hidden shadow-lg" style={{ zIndex: 20 }}>
        <figure className="h-full">
          <a href="#">
            <video
              ref={videoRef}
              id="video"
              controls
              autoPlay
              muted
              className="rounded-lg w-full h-full object-cover"
            />
          </a>
        </figure>
      </div>

      <div className="grid grid-cols-2 gap-4 mt-4">
        <div className="flex flex-col items-center justify-center bg-red-100 p-4 rounded-lg shadow-lg">
          <h3 className="text-left text-md font-semibold text-red-600">온도</h3>
          <p className="text-3xl font-bold text-gray-900" style={{ fontSize: 'clamp(1rem, 2.5vw, 1.5rem)' }}>{temperature ? parseFloat(temperature).toFixed(2) : 'Loading...'}</p>
          <div className="w-3/4 bg-gray-300 rounded-full h-4 mt-3">
            <div className="width:100% bg-red-500 h-4 rounded-full" style={{ width: temperature ? `${(parseFloat(temperature) / 50 * 100).toFixed(2)}%` : '0%' }}></div>
          </div>
        </div>
        <div className="flex flex-col items-center justify-center bg-blue-100 p-4 rounded-lg shadow-lg">
          <h3 className="text-md font-semibold text-blue-600">습도</h3>
          <p className="text-3xl font-bold text-gray-900" style={{ fontSize: 'clamp(1rem, 2.5vw, 1.5rem)' }}>{humidity ? parseFloat(humidity).toFixed(2) : 'Loading...'}</p>
          <div className="w-3/4 bg-gray-300 rounded-full h-4 mt-3">
            <div className="bg-blue-500 h-4 rounded-full" style={{ width: humidity ? `${parseFloat(humidity).toFixed(2)}%` : '0%' }}></div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 mt-4">
        <div className="flex flex-col items-center justify-center bg-purple-100 p-4 rounded-lg shadow-lg">
          <h3 className="text-md font-semibold text-purple-600">아기 상태</h3>
          <p className="text-3xl font-bold text-gray-900" style={{ fontSize: 'clamp(1rem, 2.5vw, 1.5rem)' }}>{state === 'Don’t_know' ? 'Idle' : state || 'Loading...'}</p>
        </div>
        <div className="flex flex-col items-center justify-center bg-green-100 p-4 rounded-lg shadow-lg">
          <h3 className="text-md font-semibold text-green-600">움직임 상태</h3>
          <p className="text-3xl font-bold text-gray-900" style={{ fontSize: 'clamp(1rem, 2.5vw, 1.5rem)' }}>{move_state || 'Loading...'}</p>
        </div>
      </div>


      {isModalOpen && selectedVideo && (
        <div className="fixed inset-0 bg-gray-800 bg-opacity-75 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg p-6 relative w-3/4 h-3/4">
            <button
              onClick={closeModal}
              className="bg-blue-500 text-white font-semibold py-1 px-2 rounded-md shadow-md hover:bg-blue-600 transition duration-300 ease-in-out"
            >
              Close
            </button>
            <video
              src={selectedVideo}
              autoPlay
              controls
              className="rounded-lg w-full h-full"
            />
          </div>
        </div>
      )}


    </div>

  )
}


export default UserSession