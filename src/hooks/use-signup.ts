import { ChangeEvent, useContext, useState } from 'react'
import { useDispatch } from 'react-redux'
import { userClient } from '@/client'
import { LOCALSTORAGE_TOKEN_NAME } from '@/constants'
import { ToasterMessageContext } from '@/context'
import { initCards } from '@/store/cards-slice'
import { setUser } from '@/store/user-slice'

export default function useSignup() {
    const { setToasterMessageTimeOut } = useContext(ToasterMessageContext)

    const dispatch = useDispatch()

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

        signupSubmit: async (e: Event) => {
            e.preventDefault()
            setLoading(true)
            const { username, password, confirmPassword, nickname } =
                signupInput

            const createUserRes = await userClient.create(
                username,
                nickname,
                password,
                confirmPassword,
            )

            if (createUserRes.status === 200 && 'data' in createUserRes) {
                const { username, profile, nickname } = createUserRes.data

                localStorage.setItem(LOCALSTORAGE_TOKEN_NAME, username)

                dispatch(setUser({ username, profile, nickname }))
                dispatch(initCards({ cards: [] }))
                setToasterMessageTimeOut('Sign up sucessfully!!')
            } else if (
                createUserRes.status !== 200 &&
                'reason' in createUserRes
            ) {
                setErrorMessage(createUserRes.reason)
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
