import { useEffect, ReactNode } from 'react'
import { useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { cardClient, userClient } from '@/client'
import { initCards } from '@/store/cardsSlice'
import { setUser } from '@/store/userSlice'
import { LOCALSTORAGE_TOKEN_NAME } from '@/constants'
import { AppDispatch, RootState } from '@/store'

interface GuestOnlyProps {
    children: ReactNode
}

export default function GuestOnly({ children }: GuestOnlyProps) {
    const userState = useSelector((state: RootState) => state.user)
    const dispatch = useDispatch<AppDispatch>()
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

            const getUserRes = await userClient.get(storageUsername)
            if (getUserRes.status === 200 && 'data' in getUserRes) {
                const { username, nickname, profile } = getUserRes.data
                const getCardListRes = await cardClient.getList(username)

                if (getCardListRes.status === 200 && 'data' in getCardListRes) {
                    dispatch(setUser({ username, nickname, profile }))
                    dispatch(initCards({ cards: getCardListRes.data }))
                    return navigate('/')
                } else if (
                    getCardListRes.status === 400 &&
                    'reason' in getCardListRes
                ) {
                    console.error(
                        `Unexpected Error in requesting card list - ${getCardListRes.reason}`,
                    )
                    localStorage.removeItem(LOCALSTORAGE_TOKEN_NAME)
                }
            } else if (getUserRes.status === 400 && 'reason' in getUserRes) {
                console.error(
                    `Unexpected Error in verifying user - ${getUserRes.reason}`,
                )
                localStorage.removeItem(LOCALSTORAGE_TOKEN_NAME)
            }
        })()
    }, [userState])

    return children
}
