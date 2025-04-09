import { ReactNode, useContext, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import { initCards } from '@/store/cards-slice'
import { setUser } from '@/store/user-slice'
import { AppDispatch } from '@/store'
import { userFacade } from '@/facade'
import { jwtService } from '@/services'
import { ToasterMessageContext } from '@/context'

interface LoggedInOnlyProps {
    children: ReactNode
}

export default function LoggedInOnly({ children }: LoggedInOnlyProps) {
    const navigate = useNavigate()

    const dispatch = useDispatch<AppDispatch>()

    const { setToasterMessageTimeOut } = useContext(ToasterMessageContext)

    useEffect(() => {
        ;(async () => {
            const jwtAccessToken = jwtService.getAccessToken()

            if (!jwtAccessToken) {
                setToasterMessageTimeOut('Failed to verify token')
                navigate('/login', { replace: true })
                return
            }

            const username = await jwtService.getUsernameByAccessToken(
                jwtAccessToken,
            )

            if (!username) {
                setToasterMessageTimeOut('Failed to verify token')
                jwtService.deleteToken()
                navigate('/login', { replace: true })
                return
            }

            const getUserWithCardListRes = await userFacade.getUserWithCardList(
                username,
            )

            if (!getUserWithCardListRes.ok) {
                jwtService.deleteToken()
                setToasterMessageTimeOut('Failed to verify token')
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
