import { ChangeEvent, FormEvent, useContext, useEffect, useState } from 'react'
import { useDispatch } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { ToasterMessageContext } from '@/context'
import { initCards } from '@/store/cards-slice'
import { setUser } from '@/store/user-slice'
import { authService } from '@/services/auth-service'
import { cardService, userService } from '@/services'

export const useLogin = () => {
    const { setToasterMessageTimeOut } = useContext(ToasterMessageContext)
    useEffect(() => {
        import('@/components/main')
        import('@/components/card-display')
        import('@/components/card-editor')
    }, [])

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
                if (signInRes.reason) setErrorMessage(signInRes.reason)
                setToasterMessageTimeOut('Failed to Signin')
                setLoading(false)
                return
            }

            if (!signInRes.data) {
                setLoading(false)
                throw new Error('Type error - sign in')
            }

            const getUserRes = await userService.get(signInRes.data)

            if (!getUserRes.ok) {
                setToasterMessageTimeOut('Failed to fetch user info')
                setLoading(false)
                return
            }

            if (!getUserRes.data) {
                setLoading(false)
                throw new Error('Type error - get user')
            }

            const { username, profile, nickname } = getUserRes.data

            const getCardListRes = await cardService.getList(username)

            if (!getCardListRes.ok) {
                setToasterMessageTimeOut('Failed to fetch card info')
                setLoading(false)
                return
            }

            if (!getCardListRes.data) {
                throw new Error('Type error - get card list')
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
