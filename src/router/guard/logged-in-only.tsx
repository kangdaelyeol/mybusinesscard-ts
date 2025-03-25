import { ReactNode, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { initCards } from '@/store/cards-slice'
import { setUser } from '@/store/user-slice'
import { AppDispatch, RootState } from '@/store'
import { authHelper } from '@/helpers'

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

            const storageUsername = authHelper.getLocalStorageUsername()

            if (!storageUsername) {
                navigate('/login', { replace: true })
                return
            }

            const user = await authHelper.fetchUser(storageUsername)

            if (!user) {
                authHelper.removeLocalStorageUsername()
                navigate('/login', { replace: true })
                return
            }

            const cardList = await authHelper.fetchCardList(user.username)

            if (!cardList) {
                authHelper.removeLocalStorageUsername()
                navigate('/login', { replace: true })
                return
            }

            dispatch(
                setUser({
                    username: user.username,
                    profile: user.profile,
                    nickname: user.nickname,
                }),
            )
            dispatch(initCards({ cards: cardList }))
        })()
    }, [])

    return children
}
