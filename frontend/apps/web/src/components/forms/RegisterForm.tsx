'use client'

import { RegisterFormSchema, RegisterAction } from '@/actions/registerAction'
import { fieldApiError } from '@/lib/forms'
import { registerFormSchema } from '@/lib/validation'
import SubmitField from '@frontend/ui/forms/SubmitField'
import TextField from '@frontend/ui/forms/TextField'
import FormHeader from '@frontend/ui/forms/FormHeader'
import FormFooter from '@frontend/ui/forms/FormFooter'
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
    <>
      <FormHeader
        title="Create new account in Phobaobao"
        description="Get an access to internal application"
      />

      <form
        method="post"
        onSubmit={handleSubmit(async (data) => {
          const res = await onSubmitHandler(data)

          if (res === true) {
            signIn()
          } else if (typeof res !== 'boolean') {
            fieldApiError('username', 'username', res, setError)
            fieldApiError('password', 'password', res, setError)
            fieldApiError('password_retype', 'passwordRetype', res, setError)
            fieldApiError('first_name', 'firstName', res, setError)
            fieldApiError('last_name', 'lastName', res, setError)
          }
        })}
      >
        <TextField
          type="text"
          register={register('username')}
          formState={formState}
          label="Username"
          placeholder="Unique username or email"
        />

        <TextField
          type="password"
          register={register('password')}
          formState={formState}
          label="Password"
          placeholder="Your new password"
        />

        <TextField
          type="password"
          register={register('passwordRetype')}
          formState={formState}
          label="Retype password"
          placeholder="Verify password"
        />

        <TextField
          type="text"
          register={register('firstName')}
          label="First name"
          formState={formState}
        />

        <TextField
          type="text"
          register={register('lastName')}
          label="Last name"
          formState={formState}
        />
        <SubmitField>Sign up</SubmitField>
      </form>

      <FormFooter
        cta="Already have an account?"
        link="/login"
        title="Sign in"
      />
    </>
  )
}

export default RegisterForm
