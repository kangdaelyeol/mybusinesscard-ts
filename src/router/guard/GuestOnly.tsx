import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { userClient } from '@/client'
import { initCards } from '@/store/cardsSlice'
import { loginUser } from '@/store/userSlice'
import { LOCALSTORAGE_TOKEN_NAME } from '@/constants'

export default function GuestOnly({ children }) {
    const userState = useSelector((state) => state.user)
    const dispatch = useDispatch()
    const navigate = useNavigate()

    useEffect(() => {
        ;(async () => {
            if (userState.username) {
                navigate('/')
                return
            }

            const storageUsername = localStorage.getItem(
                LOCALSTORAGE_TOKEN_NAME,
            )

            if (!storageUsername) {
                return
            }

            const res = await userClient.get(storageUsername)

            const { username, nickname, profile, cards } = res.data

            dispatch(loginUser({ username, nickname, profile }))
            dispatch(initCards({ cards }))
            navigate('/')
        })()
    }, [userState])

    return children
}
