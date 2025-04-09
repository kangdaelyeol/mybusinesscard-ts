import { ReactNode, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { initCards } from '@/store/cards-slice'
import { setUser } from '@/store/user-slice'
import { AppDispatch, RootState } from '@/store'
import { userFacade } from '@/facade'

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

            if (!jwtAccessToken) {

            if (!storageUsername) {
                navigate('/login', { replace: true })
                return
            }

            const getUserWithCardListRes = await userFacade.getUserWithCardList(
                username,
            )

            if (!getUserWithCardListRes.ok) {
                jwtService.deleteToken()
                navigate('/login', { replace: true })
                return
            }

            const { cardList, user } = getUserWithCardListRes

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
