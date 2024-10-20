'use client'

import { signIn } from 'next-auth/react'
import TextField from '@frontend/ui/forms/TextField'
import SubmitField from '@frontend/ui/forms/SubmitField'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { loginFormSchema } from '@/lib/validation'
import { useSearchParams } from 'next/navigation'
import FormHeader from '@frontend/ui/forms/FormHeader'
import FormFooter from '@frontend/ui/forms/FormFooter'
import ErrorMessage from '@frontend/ui/messages/ErrorMessage'

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
    <>
      <h4 className="text-3xl font-semibold tracking-tight text-gray-900" style={{ textAlign: 'center'}}>
        Welcome back to PhoBaoBao
      </h4>
      <p className="mb-12 mt-2 max-w-4xl text-base leading-relaxed text-gray-600" style={{ textAlign: 'center', margin: '0 auto'}}>
        Get an access to internal application
      </p>

      {/* <h3 style={{ textAlign: 'center', margin: '0 auto' }}>Welcome back to PhoBaoBao</h3> */}
      {/* <p }>Get an access to internal application</p> */}
      {/* <FormHeader
        title="Welcome back to PhoBaoBao"
        description="Get an access to internal application"
        className="form-header"
      /> */}
      {search.has('error') && search.get('error') === 'CredentialsSignin' && (
        <ErrorMessage>Provided account does not exists.</ErrorMessage>
      )}

      <form
        method="post"
        action="/api/auth/callback/credentials"
        onSubmit={onSubmitHandler}
      >
        <TextField
          type="text"
          register={register('username')}
          formState={formState}
          label="Username"
          placeholder="Email address or username"
        />

        <TextField
          type="password"
          register={register('password', { required: true })}
          formState={formState}
          label="Password"
          placeholder="Enter your password"
        />

        <SubmitField className="btn btn-primary">Sign in</SubmitField>

      </form>

      <FormFooter
        cta="Don't have an account?"
        link="/register"
        title="Sign up"
      />
    </>
  )
}

export default LoginForm
