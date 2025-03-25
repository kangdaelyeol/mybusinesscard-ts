import { ReactNode, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { cardClient, userClient } from '@/client'
import { initCards } from '@/store/cardsSlice'
import { setUser } from '@/store/userSlice'
import { LOCALSTORAGE_TOKEN_NAME } from '@/constants'
import { AppDispatch, RootState } from '@/store'

interface LoggedInOnlyProps {
    children: ReactNode
}

export default function LoggedInOnly({ children }: LoggedInOnlyProps) {
    const userState = useSelector((state: RootState) => state.user)

    const navigate = useNavigate()

    const dispatch = useDispatch<AppDispatch>()

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

            const getUserRes = await userClient.get(storageUsername)

            if (getUserRes.status === 200 && 'data' in getUserRes) {
                const { username, profile, nickname } = getUserRes.data

                const getCardListRes = await cardClient.getList(username)

                if (getCardListRes.status === 200 && 'data' in getCardListRes) {
                    dispatch(setUser({ username, profile, nickname }))
                    dispatch(initCards({ cards: getCardListRes.data }))
                    return
                } else if (
                    getCardListRes.status === 400 &&
                    'reason' in getCardListRes
                ) {
                    console.error(
                        `Unexpected Error in requesting cards - ${getCardListRes.reason}`,
                    )
                    localStorage.removeItem(storageUsername)
                    navigate('/')
                    return
                }
            } else if (getUserRes.status === 400 && 'reason' in getUserRes) {
                console.error(
                    `Unexpected Error in verifying user - ${getUserRes.reason}`,
                )
                localStorage.removeItem(storageUsername)
                navigate('/')
                return
            }
        })()
    }, [])

    return children
}
