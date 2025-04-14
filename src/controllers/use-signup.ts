import { ChangeEvent, FormEvent, useContext, useState } from 'react'
import { useDispatch } from 'react-redux'
import { ToasterMessageContext } from '@/context'
import { initCards } from '@/store/cards-slice'
import { setUser } from '@/store/user-slice'
import { userService } from '@/services'
import { LOCALSTORAGE_JWT_ACCESS_TOKEN_NAME } from '@/constants'
import { jwtUtil } from '@/auth'
import { useNavigate } from 'react-router-dom'

export const useSignup = () => {
    const { setToasterMessageTimeOut } = useContext(ToasterMessageContext)

    const dispatch = useDispatch()

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

            if (createUserRes.ok) {
                if (!createUserRes.data) {
                    throw new Error('type Error - create user')
                }

                const { username, profile, nickname } = createUserRes.data

                const jwtToken = await jwtUtil.generateToken(username, false)
                localStorage.setItem(
                    LOCALSTORAGE_JWT_ACCESS_TOKEN_NAME,
                    jwtToken.accessToken,
                )

                dispatch(setUser({ username, profile, nickname }))
                dispatch(initCards({ cards: [] }))
                setToasterMessageTimeOut('Sign up sucessfully!!')
                navigate('/')
            } else {
                if (createUserRes.reason) setErrorMessage(createUserRes.reason)
                setLoading(false)
            }
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
