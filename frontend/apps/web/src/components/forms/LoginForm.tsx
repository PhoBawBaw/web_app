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
    <div className="relative w-screen h-screen bg-[#22c7a9] flex flex-col items-center justify-center overflow-hidden">
      <img
        className="w-[300px] h-[300px] mb-4"
        alt="Baby monitoring illustration"
        src="https://cdn.animaapp.com/projects/67178667ef0c327f259c7b14/releases/6717877010fcf50a30bcebb0/img/group-30@2x.png"
      />

      <div className="text-center">
        <h1 className="text-[33px] font-extrabold text-white">Welcome Back</h1>
        <p className="text-white text-sm font-light mt-2">Get access to the internal application</p>
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

        <div className="top-[577px] absolute w-[339px] h-[59px] left-[50px] rounded-[15px]">
          {/* <img
            className="absolute w-[29px] h-[29px] top-3 left-[15px]"
            alt="Vector"
            src="https://c.animaapp.com/M8gyN7QH/img/vector.svg"
          /> */}

          <div className="relative w-[339px] h-[59px] bg-[#f3f3f3] rounded-[15px] shadow-[0px_2px_1px_#0000001f]">
            <div className="absolute top-[50%] left-[15px] transform -translate-y-1/2">
              <img src="https://c.animaapp.com/M8gyN7QH/img/vector-2.svg" alt="icon" className="w-[30px] h-[30px]" />
            </div>
            <TextField
              type="text"
              register={register('username')}
              formState={formState}
              placeholder="Email address or username"
              className="[font-family:'Poppins',Helvetica] font-medium text-[#666161] text-[15px] tracking-[0] leading-[normal] pl-[60px] h-full w-[calc(100%-60px)] bg-[#f3f3f3] border-none outline-none"
            />
          </div>
          {/* <div className="absolute w-[339px] h-[59px] top-0 left-0 bg-[#f3f3f3] rounded-[15px] shadow-[0px_2px_1px_#0000001f]">
            <TextField
              type="text"
              register={register('username')}
              formState={formState}
              // label="Username"
              placeholder="Email address or username"
              className="absolute top-[19px] left-[66px] [font-family:'Poppins',Helvetica] font-medium text-[#666161] text-[15px] tracking-[0] leading-[normal]"
            />
          </div>
          <img
            className="absolute w-[23px] h-[22px] top-[21px] left-[19px]"
            alt="Vector"
            src="https://c.animaapp.com/M8gyN7QH/img/vector-2.svg"
          /> */}
        </div>
        {/* <div className="relative">
          <div className="absolute w-[339px] h-[59px] top-0 left-0 bg-[#f3f3f3] rounded-[15px] shadow-[0px_2px_1px_#0000001f]" />
          <TextField
            type="text"
            register={register('username')}
            formState={formState}
            // label="Username"
            placeholder="Email address or username"
            className="absolute w-[339px] h-[59px] top-0 left-0 bg-[#f3f3f3] rounded-[15px] shadow-[0px_2px_1px_#0000001f]"
          />
          <Image
            src="https://c.animaapp.com/M8gyN7QH/img/vector.svg"
            alt="Email Icon"
            width={24}
            height={24}
            className="absolute top-1/2 left-3 transform -translate-y-1/2"
          />
        </div> */}

        <div className="relative">
          <TextField
            type="password"
            register={register('password', { required: true })}
            formState={formState}
            label="Password"
            placeholder="Enter your password"
            className="w-full pl-10 p-3 border rounded-[15px] focus:outline-none focus:ring focus:ring-teal-300"
          />
          <Image
            src="/path-to-password-icon.svg"
            alt="Password Icon"
            width={24}
            height={24}
            className="absolute top-1/2 left-3 transform -translate-y-1/2"
          />
        </div>
        <div className="flex justify-between text-sm">
          <a href="/register" className="text-teal-600">Sign Up</a>
        </div>
        <SubmitField className="w-full py-3 bg-[#f3f3f3] text-teal-600 rounded-[15px] hover:bg-teal-600 hover:text-white">
          Sign in
        </SubmitField>
      </form>
    </div>
    // </div>
  )
}

export default LoginForm
