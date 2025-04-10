import { ChangeEvent, FormEvent, useContext, useState } from 'react'
import { useDispatch } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import {
    LOCALSTORAGE_JWT_ACCESS_TOKEN_NAME,
    LOCALSTORAGE_JWT_REFRESH_TOKEN_NAME,
} from '@/constants'
import { ToasterMessageContext } from '@/context'
import { initCards } from '@/store/cards-slice'
import { setUser } from '@/store/user-slice'
import { authService } from '@/services/auth-service'
import { cardService, userService } from '@/services'
import { jwtUtil } from '@/utils'

export const useLogin = () => {
    const { setToasterMessageTimeOut } = useContext(ToasterMessageContext)

    const dispatch = useDispatch()

    const [loading, setLoading] = useState(false)
    const [errorMessage, setErrorMessage] = useState('')
    const [loginInput, setLoginInput] = useState<{
        username: string
        password: string
        remember: boolean
    }>({
        username: '',
        password: '',
        remember: false,
    })

    const navigate = useNavigate()

    const handlers = {
        userLogin: async (e: FormEvent<HTMLFormElement>) => {
            e.preventDefault()
            if (loading) return

            setLoading(true)

            const signInRes = await authService.signIn(
                loginInput.username,
                loginInput.password,
            )

            if (!signInRes.ok) {
                setErrorMessage(signInRes.reason)
                setToasterMessageTimeOut('Failed to Signin')
                setLoading(false)
                return
            }

            const getUserRes = await userService.get(signInRes.data)

            if (!getUserRes.ok) {
                setToasterMessageTimeOut('Failed to fetch user info')
                setLoading(false)
                return
            }

            const { username, profile, nickname } = getUserRes.data

            const getCardListRes = await cardService.getList(username)

            if (!getCardListRes.ok) {
                setToasterMessageTimeOut('Failed to fetch card info')
                setLoading(false)
                return
            }

            const jwtToken = await jwtUtil.generateToken(
                username,
                loginInput.remember,
            )

            localStorage.setItem(
                LOCALSTORAGE_JWT_ACCESS_TOKEN_NAME,
                jwtToken.accessToken,
            )

            if (jwtToken.refreshToken) {
                localStorage.setItem(
                    LOCALSTORAGE_JWT_REFRESH_TOKEN_NAME,
                    jwtToken.refreshToken,
                )
            }

            dispatch(setUser({ username, profile, nickname }))
            dispatch(initCards({ cards: getCardListRes.data }))
            setToasterMessageTimeOut('Logged in successfully!!')
            setLoading(false)
            navigate('/')
        },

        usernameInput: (e: ChangeEvent<HTMLInputElement>) => {
            setErrorMessage('')
            setLoginInput((prev) => ({ ...prev, username: e.target.value }))
        },

        passwordInput: (e: ChangeEvent<HTMLInputElement>) => {
            setErrorMessage('')
            setLoginInput((prev) => ({ ...prev, password: e.target.value }))
        },

        rememberMeChange: () => {
            setLoginInput((prev) => ({ ...prev, remember: !prev.remember }))
        },
    }

    return {
        handlers,
        loading,
        loginInput,
        errorMessage,
    }
}
