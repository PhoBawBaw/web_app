'use client'

import { useSession, signIn } from 'next-auth/react'
import UserSession from '@/components/UserSession'
import LoginForm from '@/components/forms/LoginForm'

const Home = () => {
  const { status } = useSession();

  if (status === 'loading') {
    return <p>Loading...</p>;
  }

  if (status === 'unauthenticated') {
    return (
      <LoginForm />
    );
  }

  return (
    <div className="flex-grow">
      <UserSession />
    </div>
  );
}

export default Home;
