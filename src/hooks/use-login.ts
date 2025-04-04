import { ChangeEvent, useContext, useState } from 'react'
import { useDispatch } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { cardClient } from '@/client'
import { LOCALSTORAGE_TOKEN_NAME } from '@/constants'
import { ToasterMessageContext } from '@/context'
import { initCards } from '@/store/cards-slice'
import { setUser } from '@/store/user-slice'
import { authService } from '@/services/auth-service'
import { userService } from '@/services'

export const useLogin = () => {
    const { setToasterMessageTimeOut } = useContext(ToasterMessageContext)

    const dispatch = useDispatch()

    const [loading, setLoading] = useState(false)
    const [errorMessage, setErrorMessage] = useState('')
    const [loginInput, setLoginInput] = useState({
        username: '',
        password: '',
        remember: false,
    })

    const navigate = useNavigate()

    const handlers = {
        userLogin: async (e: Event) => {
            e.preventDefault()
            if (loading) return

            setLoading(true)

            const signInRes = await authService.signIn(
                loginInput.username,
                loginInput.password,
                loginInput.remember,
            )

            if (!signInRes.ok) {
                setToasterMessageTimeOut('Failed to Signin')
                return
            }

            const getUserRes = await userService.get(signInRes.data)

            if (!getUserRes.ok) {
                setToasterMessageTimeOut('Failed to fetch user info')
                localStorage.removeItem(LOCALSTORAGE_TOKEN_NAME)
                setLoading(false)
                return
            }

            const { username, profile, nickname } = getUserRes.data

            const getCardListRes = await cardClient.getList(username)

            if (getCardListRes.status && 'data' in getCardListRes) {
                dispatch(setUser({ username, profile, nickname }))
                dispatch(initCards({ cards: getCardListRes.data }))
                setToasterMessageTimeOut('Logged in successfully!!')
                setLoading(false)
                navigate('/')
            } else if (getCardListRes.status !== 200) {
                setToasterMessageTimeOut('Failed to fetch card info')
                localStorage.removeItem(LOCALSTORAGE_TOKEN_NAME)
                setLoading(false)
                return
            }
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
