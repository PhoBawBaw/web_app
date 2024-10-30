'use client'

import { signIn } from 'next-auth/react'
import TextField from '@frontend/ui/forms/TextField'
import SubmitField from '@frontend/ui/forms/SubmitField'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { loginFormSchema } from '@/lib/validation'
import { useSearchParams } from 'next/navigation'
import ErrorMessage from '@frontend/ui/messages/ErrorMessage'
import Image from 'next/image' // Importing Image for the avatar or illustration

type LoginFormSchema = z.infer<typeof loginFormSchema>

const LoginForm: React.FC = () => {
  const search = useSearchParams()

  const { register, handleSubmit, formState } = useForm<LoginFormSchema>({
    resolver: zodResolver(loginFormSchema)
  })

  const onSubmitHandler = handleSubmit((data) => {
    signIn('credentials', {
      username: data.username,
      password: data.password,
      callbackUrl: '/'
    })
  })

  return (
    <div className="relative flex flex-col items-center justify-center overflow-hidden">
      <img
        className="w-[300px] h-[300px] mb-10 mt-10"
        alt="Baby monitoring illustration"
        src="https://cdn.animaapp.com/projects/67178667ef0c327f259c7b14/releases/6717877010fcf50a30bcebb0/img/group-30@2x.png"
      />

      <div className="text-center">
        <h1 className="text-[33px] font-extrabold text-white">PhoBawBaw</h1>
        {/* <p className="text-white text-sm font-light mt-2">Get access to the internal application</p> */}
      </div>

      {search.has('error') && search.get('error') === 'CredentialsSignin' && (
        <ErrorMessage>Provided account does not exist.</ErrorMessage>
      )}

      <form
        method="post"
        action="/api/auth/callback/credentials"
        onSubmit={onSubmitHandler}
        className="space-y-1"
      >
        <div className="flex justify-between text-sm">
          <p className="text-white text-sm font-light mt-2">아이디</p>
        </div>
        <div className="relative flex items-center bg-[#f3f3f3] rounded-[15px] shadow p-4">
          <input
            type="text"
            {...register('username')}
            placeholder="아이디를 입력하세요"
            className="bg-transparent w-full focus:outline-none text-gray-700"
          />
        </div>
        <div className="flex justify-between text-sm">
          <p className="text-white text-sm font-light mt-2">비밀번호</p>
        </div>
        <div className="relative flex items-center bg-[#f3f3f3] rounded-[15px] shadow p-4">
          <input
            type="password"
            {...register('password', { required: true })}
            placeholder="비밀번호를 입력하세요"
            className="bg-transparent w-full focus:outline-none text-gray-700"
          />
        </div>
        <br></br>
        <div className="flex justify-between text-sm">
          <a href="/register" className="text-teal-600">아직 계정이 없으신가요?</a>
        </div>
        <button type="submit" className="w-full bg-[#DFB497] text-white font-semibold py-2 px-4 rounded-[30px] shadow p-4">
          로그인
        </button>
      </form>
    </div>
  )
}

export default LoginForm
