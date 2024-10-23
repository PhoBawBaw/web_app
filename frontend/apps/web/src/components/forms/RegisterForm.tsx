'use client'

import { RegisterFormSchema, RegisterAction } from '@/actions/registerAction'
import { fieldApiError } from '@/lib/forms'
import { registerFormSchema } from '@/lib/validation'
import SubmitField from '@frontend/ui/forms/SubmitField'
import TextField from '@frontend/ui/forms/TextField'
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
      <div className="sign-up">
        <div className="div-3">
          <div className="overlap">
            <img
              className="group-2"
              alt="Group"
              src="https://cdn.animaapp.com/projects/67178667ef0c327f259c7b14/releases/6717877010fcf50a30bcebb0/img/group-30@2x.png"
            />
            <div className="rectangle-2" />

            {/* Username */}
            <TextField
              type="text"
              className="text-wrapper-3"
              register={register('username')}
              formState={formState}
              // label="Username"
              placeholder="Enter your username"
            />
            <div className="text-wrapper-3">

            </div>

            <img
              className="vector-2"
              alt="Vector"
              src="https://cdn.animaapp.com/projects/67178667ef0c327f259c7b14/releases/6717877010fcf50a30bcebb0/img/vector.svg"
            />
          </div>

          <img
            className="group-3"
            alt="Group"
            src="https://cdn.animaapp.com/projects/67178667ef0c327f259c7b14/releases/6717877010fcf50a30bcebb0/img/group-5@2x.png"
          />

          {/* Password */}
          <div className="overlap-group-2">
            <div className="text-wrapper-4">
              <TextField
                type="password"
                register={register('password')}
                formState={formState}
                label="Password"
                placeholder="Your new password"
              />
            </div>

            <img
              className="vector-3"
              alt="Vector"
              src="https://cdn.animaapp.com/projects/67178667ef0c327f259c7b14/releases/6717877010fcf50a30bcebb0/img/vector.svg"
            />
          </div>

          {/* Retype password */}
          <div className="overlap-2">
            <div className="text-wrapper-5">
              <TextField
                type="password"
                register={register('passwordRetype')}
                formState={formState}
                label="Retype password"
                placeholder="Verify password"
              />
            </div>

            <img
              className="vector-4"
              alt="Vector"
              src="https://cdn.animaapp.com/projects/67178667ef0c327f259c7b14/releases/6717877010fcf50a30bcebb0/img/vector-3.svg"
            />
          </div>

          {/* First Name */}
          <div className="overlap-3">
            <div className="text-wrapper-6">
              <TextField
                type="text"
                register={register('firstName')}
                formState={formState}
                label="First name"
                placeholder="Enter your first name"
              />
            </div>

            <img
              className="vector-5"
              alt="Vector"
              src="https://cdn.animaapp.com/projects/67178667ef0c327f259c7b14/releases/6717877010fcf50a30bcebb0/img/vector-2.svg"
            />
          </div>

          {/* Last Name */}
          <div className="overlap-4">
            <div className="text-wrapper-7">
              <TextField
                type="text"
                register={register('lastName')}
                formState={formState}
                label="Last name"
                placeholder="Enter your last name"
              />
            </div>

            <img
              className="vector-6"
              alt="Vector"
              src="https://cdn.animaapp.com/projects/67178667ef0c327f259c7b14/releases/6717877010fcf50a30bcebb0/img/vector-2.svg"
            />
          </div>
        </div>
      </div>

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
