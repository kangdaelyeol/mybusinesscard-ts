import { ReactNode, useContext, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import { initCards } from '@/store/cards-slice'
import { setUser } from '@/store/user-slice'
import { AppDispatch } from '@/store'
import { userFacade } from '@/facade'
import { ToasterMessageContext } from '@/context'
import { jwtUtil } from '@/auth'

interface LoggedInOnlyProps {
    children: ReactNode
}

export default function LoggedInOnly({ children }: LoggedInOnlyProps) {
    const navigate = useNavigate()

    const dispatch = useDispatch<AppDispatch>()

    const { setToasterMessageTimeOut } = useContext(ToasterMessageContext)

    useEffect(() => {
        ;(async () => {
            const jwtAccessToken = jwtUtil.getAccessToken()

            if (!jwtAccessToken) {
                setToasterMessageTimeOut('Failed to verify token')
                navigate('/login', { replace: true })
                return
            }

            const username = await jwtUtil.getUsernameByAccessToken(
                jwtAccessToken,
            )

            if (!username) {
                setToasterMessageTimeOut('Failed to verify token')
                jwtUtil.deleteToken()
                navigate('/login', { replace: true })
                return
            }

            const getUserWithCardListRes = await userFacade.getUserWithCardList(
                username,
            )

            if (!getUserWithCardListRes.ok) {
                jwtUtil.deleteToken()
                setToasterMessageTimeOut('Failed to verify token')
                navigate('/login', { replace: true })
                return
            }

            if (!getUserWithCardListRes.data) {
                throw new Error(
                    'unexpected type error - get user and card list',
                )
            }

            const { cardList, user } = getUserWithCardListRes.data

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
