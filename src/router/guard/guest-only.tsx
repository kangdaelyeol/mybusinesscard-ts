import { useEffect, ReactNode, useContext } from 'react'
import { useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { initCards } from '@/store/cards-slice'
import { clearUser, setUser } from '@/store/user-slice'
import { AppDispatch, RootState } from '@/store'
import { userFacade } from '@/facade'
import { ToasterMessageContext } from '@/context'
import { jwtService } from '@/services'

interface GuestOnlyProps {
    children: ReactNode
}

export default function GuestOnly({ children }: GuestOnlyProps) {
    const userState = useSelector((state: RootState) => state.user)
    const dispatch = useDispatch<AppDispatch>()
    const navigate = useNavigate()
    const { setToasterMessageTimeOut } = useContext(ToasterMessageContext)

    useEffect(() => {
        ;(async () => {
            const jwtRefreshToken = jwtService.getRefreshToken()

            if (!jwtRefreshToken) {
                setToasterMessageTimeOut('Failed to verify token')
                dispatch(clearUser())
                return
            }

            const jwtAccessToken =
                await jwtService.generateAccessTokenByRefreshToken(
                    jwtRefreshToken,
                )

            if (!jwtAccessToken) {
                setToasterMessageTimeOut('Failed to verify token')
                dispatch(clearUser())
                return
            }

            const username = await jwtService.getUsernameByAccessToken(
                jwtAccessToken,
            )

            if (!username) {
                setToasterMessageTimeOut('Failed to verify token')
                jwtService.deleteToken()
                dispatch(clearUser())
                return
            }

            const getUserWithCardListRes = await userFacade.getUserWithCardList(
                username,
            )

            if (!getUserWithCardListRes.ok) {
                setToasterMessageTimeOut('Failed to load user and card data')
                jwtService.deleteToken()
                dispatch(clearUser())
                return
            }

            const { cardList, user } = getUserWithCardListRes

            dispatch(initCards({ cards: cardList }))
            setUser({
                username: user.username,
                profile: user.profile,
                nickname: user.nickname,
            })
            navigate('/')
        })()
    }, [userState])

    return children
}
