'use client';

import { useSession } from 'next-auth/react';
import { useState } from 'react';
import UserSession from '@/components/UserSession';
import LoginForm from '@/components/forms/LoginForm';
import StartScreen from '@/components/pages/home_page';

const Home = () => {
  const { status } = useSession();
  const [showLoginForm, setShowLoginForm] = useState(false);

  // 세션이 로딩 중일 때
  if (status === 'loading') {
    return <p>Loading...</p>;
  }

  // 로그인을 하지 않은 상태에서 로그인 폼이 활성화된 경우
  if (status === 'unauthenticated' && showLoginForm) {
    return <LoginForm />;
  }

  return (
    <>
      {/* 로그인이 되어 있지 않은 경우 */}
      {status === 'unauthenticated' ? (
        <>
          <StartScreen />
        </>
      ) : (
        // 로그인이 되어 있는 경우 UserSession을 보여줍니다.
        <div className="flex-grow">
          <UserSession />
        </div>
      )}
    </>
  );
};

export default Home;
