import { ChangeEvent, useContext, useState } from 'react'
import { useDispatch } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { authClient, cardClient } from '@/client'
import { LOCALSTORAGE_TOKEN_NAME } from '@/constants'
import { ToasterMessageContext } from '@/context'
import { initCards } from '@/store/cards-slice'
import { setUser } from '@/store/user-slice'

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

            const signInRes = await authClient.signIn(
                loginInput.username,
                loginInput.password,
            )

            if (signInRes.status === 200 && 'data' in signInRes) {
                const { username, profile, nickname } = signInRes.data
                if (loginInput.remember)
                    localStorage.setItem(LOCALSTORAGE_TOKEN_NAME, username)

                const getCardListRes = await cardClient.getList(username)
                if (getCardListRes.status === 200 && 'data' in getCardListRes) {
                    dispatch(setUser({ username, profile, nickname }))
                    dispatch(initCards({ cards: getCardListRes.data }))
                    setToasterMessageTimeOut('Logged in successfully!!')
                    navigate('/')
                } else if (
                    getCardListRes.status !== 200 &&
                    'reason' in getCardListRes
                ) {
                    setErrorMessage(getCardListRes.reason)
                }
            } else if (signInRes.status !== 200 && 'reason' in signInRes) {
                setErrorMessage(signInRes.reason)
            }
            setLoading(false)
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
