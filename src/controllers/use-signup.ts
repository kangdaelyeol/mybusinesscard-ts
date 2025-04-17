import { ChangeEvent, FormEvent, useContext, useState } from 'react'
import { ToasterMessageContext } from '@/context'
import { userService } from '@/services'
import { useNavigate } from 'react-router-dom'

export const useSignup = () => {
    const { setToasterMessageTimeOut } = useContext(ToasterMessageContext)

    const navigate = useNavigate()

    const [errorMessage, setErrorMessage] = useState('')
    const [loading, setLoading] = useState(false)
    const [signupInput, setSignupInput] = useState({
        username: '',
        password: '',
        nickname: '',
        confirmPassword: '',
    })

    const handlers = {
        usernameChange: (e: ChangeEvent<HTMLInputElement>) => {
            setErrorMessage('')
            setSignupInput((prev) => ({ ...prev, username: e.target.value }))
        },

        passwordChange: (e: ChangeEvent<HTMLInputElement>) => {
            setErrorMessage('')
            setSignupInput((prev) => ({ ...prev, password: e.target.value }))
        },

        confirmPasswordChange: (e: ChangeEvent<HTMLInputElement>) => {
            setErrorMessage('')
            setSignupInput((prev) => ({
                ...prev,
                confirmPassword: e.target.value,
            }))
        },

        nicknameChange: (e: ChangeEvent<HTMLInputElement>) => {
            setErrorMessage('')
            setSignupInput((prev) => ({ ...prev, nickname: e.target.value }))
        },

        signupSubmit: async (e: FormEvent<HTMLFormElement>) => {
            if (loading) return
            e.preventDefault()
            setLoading(true)
            const { username, password, confirmPassword, nickname } =
                signupInput

            const createUserRes = await userService.create(
                username,
                password,
                confirmPassword,
                nickname,
            )

            if (!createUserRes.ok) {
                if (createUserRes.reason) setErrorMessage(createUserRes.reason)
                setLoading(false)
                return
            }

            if (!createUserRes.data) {
                throw new Error('type Error - create user')
            }

            setToasterMessageTimeOut('Sign up sucessfully!!')
            navigate('/login')
            setLoading(false)
        },
    }

    return {
        handlers,
        loading,
        signupInput,
        errorMessage,
    }
}
