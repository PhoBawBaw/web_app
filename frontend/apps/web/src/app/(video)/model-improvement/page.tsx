'use client'

import { useSession } from 'next-auth/react';
import { useEffect, useRef, useState } from 'react';
import { signIn, signOut } from 'next-auth/react';
import useAudio from '@/hooks/useAudio';
import useSubmitClassification from '@/hooks/useImprove';

const SignOutLink: React.FC = () => {
    return (
        <span
            onClick={() => signOut()}
            className="text-gray-700 font-semibold cursor-pointer hover:text-black transition duration-300 ease-in-out"
        >
            로그아웃
        </span>
    );
};
const UserSession: React.FC = () => {
    const { data: session, status } = useSession();
    const audios = useAudio() || [];
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const toggleSidebar = () => {
        setIsSidebarOpen(!isSidebarOpen);
    };
    const { submitClassification, isSubmitting, error } = useSubmitClassification();
    // const [modelMessage, setModelMessage] = useState("");
    const [isFetchingMessage, setIsFetchingMessage] = useState(false);
    const [classifications, setClassifications] = useState<{ [key: string]: string }>({});
    const [currentAudio, setCurrentAudio] = useState<string | null>(null); // State for current audio
    const audioPlayerRef = useRef<HTMLAudioElement>(null); // Ref for the audio player

    const handleClassificationChange = (audioName: string, classification: string) => {
        setClassifications((prev) => ({
            ...prev,
            [audioName]: classification
        }));
    };

    const handleSubmit = async (audioName: string) => {
        const classification = classifications[audioName];
        if (!classification) {
            alert("먼저 아기 상태를 선택해주세요!");
            return;
        }

        await submitClassification(audioName, classification);
    };

    // Play the audio when a user selects it
    const handleAudioClick = (audioUrl: string) => {
        setCurrentAudio(audioUrl);
        if (audioPlayerRef.current) {
            audioPlayerRef.current.src = audioUrl;
            audioPlayerRef.current.play();
        }
    };
    const fetchModelMessage = async () => {
        setIsFetchingMessage(true);
        try {
            const response = await fetch('http://<ip address>:58000/api/users/model-continual/');
            const data = await response.json();
            alert(data.message);
            // setModelMessage(data.message);
        } catch (error) {
            console.error("Error fetching model message:", error);
            alert("오류가 발생했습니다. 다시 시도해주세요.");
            // setModelMessage("오류가 발생했습니다. 다시 시도해주세요.");
        } finally {
            setIsFetchingMessage(false);
        }
    };

    return (
        <div className="relative">
            <div className="flex flex-col  mb-2">
                <div className="flex justify-between items-center p-4 mb-2">
                    {/* Left side (Monitoring text) */}
                    <div
                        className="text-left cursor-pointer"
                        onClick={() => (window.location.href = '/')}
                    >
                        <h1 className="text-2xl font-semibold text-white">음성 녹음 목록</h1>
                        <p className="text-sm text-[#EDE9E9]">아기의 울음소리를 분류함으로써 우리 아기에게 최적화된 모델로 개선하세요!</p>
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
                        <ul className="mt-4">
                            <li className="mb-2"></li>
                            <li>
                                <a href="/" className="flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group">
                                    <svg className="w-6 h-6 text-gray-800 " aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24"> <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m4 12 8-8 8 8M6 10.5V19a1 1 0 0 0 1 1h3v-3a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v3h3a1 1 0 0 0 1-1v-8.5" /> </svg>
                                    <span className="flex-1 ms-3 whitespace-nowrap text-gray-700">Home</span>
                                </a>
                            </li>

                            <li>
                                <a href="/video-list" className="flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group">
                                    <img
                                        className="w-[26px] h-6 top-[61px] left-[17px] object-cover"
                                        alt="Baby"
                                        src="https://c.animaapp.com/Sti7WLph/img/baby-1@2x.png"
                                    />
                                    <span className="flex-1 ms-3 whitespace-nowrap text-gray-700">녹화 영상</span>
                                </a>
                            </li>
                            <li>
                                <a href="/state-list" className="flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group">
                                    <img
                                        className="w-[20px] h-[25px] top-[9px] left-[18px] object-cover"
                                        alt="Baby"
                                        src="./state.png"
                                    />

                                    <span className="flex-1 ms-3 whitespace-nowrap text-gray-700">아기 상태 기록</span>
                                </a>
                            </li>
                            <li>
                                <a href="/move-list" className="flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group">
                                    <img
                                        className="w-[20px] h-[25px] top-[9px] left-[18px] object-cover"
                                        alt="Baby"
                                        src="./moving.png"
                                    />

                                    <span className="flex-1 ms-3 whitespace-nowrap text-gray-700">움직임 상태 기록</span>
                                </a>
                            </li>
                            {/* other menu items */}
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
                    </div>
                </div>
            </div>
            <div className="flex flex-col items-center">
                <div className="bg-gray-100 p-6 rounded-lg shadow-lg w-full max-w-lg">
                    {/* Audio Player */}
                    <audio ref={audioPlayerRef} controls className="w-full mb-4">
                        Your browser does not support the audio element.
                    </audio>

                    {/* Audio List with Individual Classification */}
                    <div className="bg-white p-4 rounded-lg shadow overflow-y-auto" style={{ maxHeight: '400px' }}>
                        {audios.map((audioUrl, index) => {
                            const audioName = audioUrl.split('/').pop();
                            const selectedClassification = classifications[audioName] || "";

                            return (
                                <div key={index} className="p-2 mb-4 border-b border-gray-200">
                                    <div
                                        onClick={() => handleAudioClick(audioUrl)}
                                        className="cursor-pointer text-blue-500 hover:underline"
                                    >
                                        {audioName}
                                    </div>

                                    {/* Classification Dropdown */}
                                    <div className="mt-2">
                                        <select
                                            id={`classification-${index}`}
                                            name={`classification-${index}`}
                                            value={selectedClassification}
                                            onChange={(e) => handleClassificationChange(audioName, e.target.value)}
                                            className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
                                        >
                                            <option value="" disabled>아기의 상태를 선택해주세요</option>
                                            <option value="hungry">배고픔</option>
                                            <option value="burping">트림</option>
                                            <option value="belly_pain">복통</option>
                                            <option value="discomfort">불편함</option>
                                            <option value="tired">피곤함</option>
                                            <option value="don't_know">기타</option>
                                        </select>
                                    </div>

                                    {/* Submit Button */}
                                    <div className="mt-2">
                                        <button
                                            onClick={() => handleSubmit(audioName)}
                                            className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-blue-600 text-base font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:text-sm"
                                            disabled={isSubmitting}
                                        >
                                            {isSubmitting ? "제출 중..." : "적용"}
                                        </button>
                                    </div>

                                    {/* Error Message */}
                                    {error && <p className="text-red-500 mt-2">{error}</p>}
                                </div>
                            );
                        })}
                    </div>
                    <div className="mt-2">
                        <button
                            onClick={fetchModelMessage}
                            className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-green-600 text-base font-medium text-white hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 sm:text-sm"
                            disabled={isFetchingMessage}
                        >
                            {isFetchingMessage ? "메시지 로딩 중..." : "모델 개선 상태 확인"}
                        </button>
                    </div>

                    {/* Display the fetched message */}
                    {/* {modelMessage && <p className="text-blue-500 mt-2">{modelMessage}</p>} */}
                </div>
            </div>
        </div>
    );
};

export default UserSession;
