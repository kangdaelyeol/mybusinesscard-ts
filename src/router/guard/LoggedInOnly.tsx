import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { userClient } from '@/client'
import { initCards } from '@/store/cardsSlice'
import { loginUser } from '@/store/userSlice'
import { LOCALSTORAGE_TOKEN_NAME } from '@/constants'

export default function LoggedInOnly({ children }) {
    const userState = useSelector((state) => state.user)

    const navigate = useNavigate()

    const dispatch = useDispatch()

    useEffect(() => {
        ;(async () => {
            if (userState?.username) return

            const storageUsername = localStorage.getItem(
                LOCALSTORAGE_TOKEN_NAME,
            )

            if (!storageUsername) {
                navigate('/login', { replace: true })
                return
            }

            const res = await userClient.get(storageUsername)

            const { username, profile, nickname, cards } = res.data

            dispatch(loginUser({ username, profile, nickname }))
            dispatch(initCards({ cards }))
        })()
    }, [])

    return children
}
