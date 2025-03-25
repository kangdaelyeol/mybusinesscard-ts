import { useEffect, ReactNode } from 'react'
import { useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { initCards } from '@/store/cards-slice'
import { setUser } from '@/store/user-slice'
import { AppDispatch, RootState } from '@/store'
import { authHelper } from '@/helpers'

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

            const storageUsername = authHelper.getLocalStorageUsername()

            if (!storageUsername) {
                navigate('/')
                return
            }

            const user = await authHelper.fetchUser(storageUsername)

            if (!user) {
                authHelper.removeLocalStorageUsername()
                navigate('/')
                return
            }

            const cardList = await authHelper.fetchCardList(user.username)

            if (!cardList) {
                authHelper.removeLocalStorageUsername()
                navigate('/')
                return
            }

            dispatch(initCards({ cards: cardList }))
            setUser({
                username: user.username,
                profile: user.profile,
                nickname: user.nickname,
            })
        })()
    }, [userState])

    return children
}
