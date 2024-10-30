'use client'

import type {
  RegisterAction,
  RegisterFormSchema
} from '@/actions/registerAction'
import { fieldApiError } from '@/lib/forms'
import { registerFormSchema } from '@/lib/validation'
import FormFooter from '@frontend/ui/forms/FormFooter'
import FormHeader from '@frontend/ui/forms/FormHeader'
import SubmitField from '@frontend/ui/forms/SubmitField'
import TextField from '@frontend/ui/forms/TextField'
import { zodResolver } from '@hookform/resolvers/zod'
import { signIn } from 'next-auth/react'
import { useForm } from 'react-hook-form'

const RegisterForm: React.FC<{
  onSubmitHandler: RegisterAction
}> = ({ onSubmitHandler }) => {
  const { formState, handleSubmit, register, setError } =
    useForm<RegisterFormSchema>({
      resolver: zodResolver(registerFormSchema)
    })

  return (
    <div className="relative flex flex-col items-center justify-start pt-10 overflow-hidden">
      <img
        className="w-[300px] h-[300px]"
        alt="Baby monitoring illustration"
        src="https://cdn.animaapp.com/projects/67178667ef0c327f259c7b14/releases/6717877010fcf50a30bcebb0/img/group-30@2x.png"
      />

      <form
        method="post"
        onSubmit={handleSubmit(async (data) => {
          const res = await onSubmitHandler(data);

          if (res === true) {
            signIn();
          } else if (typeof res !== 'boolean') {
            fieldApiError('username', 'username', res, setError);
            fieldApiError('password', 'password', res, setError);
            fieldApiError('password_retype', 'passwordRetype', res, setError);
          }
        })}
        className="space-y-4 w-[340px] flex flex-col items-center"
      >
        {/* Username Field */}
        <div className="w-full">
          <label className="text-white text-sm font-light">아이디</label>
          <div className="relative flex items-center bg-[#f3f3f3] rounded-[15px] shadow p-4 mt-1">
            <input
              type="text"
              {...register('username')}
              placeholder="아이디를 입력해주세요"
              className="bg-transparent w-full focus:outline-none text-gray-700"
            />
          </div>
        </div>

        {/* Password Field */}
        <div className="w-full">
          <label className="text-white text-sm font-light">비밀번호</label>
          <div className="relative flex items-center bg-[#f3f3f3] rounded-[15px] shadow p-4 mt-1">
            <input
              type="password"
              {...register('password', { required: true })}
              placeholder="비밀번호를 입력해주세요"
              className="bg-transparent w-full focus:outline-none text-gray-700"
            />
          </div>
        </div>

        {/* Retype Password Field */}
        <div className="w-full">
          <label className="text-white text-sm font-light">비밀번호 재입력</label>
          <div className="relative flex items-center bg-[#f3f3f3] rounded-[15px] shadow p-4 mt-1">
            <input
              type="password"
              {...register('passwordRetype')}
              placeholder="비밀번호를 다시 입력해주세요"
              className="bg-transparent w-full focus:outline-none text-gray-700"
            />
          </div>
        </div>

        {/* Footer */}
        <div className="flex justify-between w-full text-sm mt-2">
          <span className="text-white">계정이 이미 있으신가요?</span>
          <a href="/login" className="text-teal-600">로그인</a>
        </div>

        <button
          type="submit"
          className="w-full bg-[#DFB497] text-white font-semibold py-2 px-4 rounded-[30px] shadow mt-4"
        >
          회원가입
        </button>
      </form>
    </div>
  );
};

export default RegisterForm;