import { useEffect, ReactNode, useContext } from 'react'
import { useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { initCards } from '@/store/cards-slice'
import { clearUser, setUser } from '@/store/user-slice'
import { AppDispatch, RootState } from '@/store'
import { userFacade } from '@/facade'
import { ToasterMessageContext } from '@/context'
import { jwtUtil } from '@/auth'

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
            const jwtRefreshToken = jwtUtil.getRefreshToken()

            if (!jwtRefreshToken) {
                dispatch(clearUser())
                return
            }

            const jwtAccessToken =
                await jwtUtil.generateAccessTokenByRefreshToken(jwtRefreshToken)

            if (!jwtAccessToken) {
                setToasterMessageTimeOut('Failed to verify token')
                jwtUtil.deleteToken()
                dispatch(clearUser())
                return
            }

            const username = await jwtUtil.getUsernameByAccessToken(
                jwtAccessToken,
            )

            if (!username) {
                setToasterMessageTimeOut('Failed to verify token')
                jwtUtil.deleteToken()
                dispatch(clearUser())
                return
            }

            const getUserWithCardListRes = await userFacade.getUserWithCardList(
                username,
            )

            if (!getUserWithCardListRes.ok) {
                setToasterMessageTimeOut('Failed to load user and card data')
                jwtUtil.deleteToken()
                dispatch(clearUser())
                return
            }

            if (!getUserWithCardListRes.data) {
                throw new Error(
                    "'Unexpected Type Error - get user and card list',",
                )
            }

            const { cardList, user } = getUserWithCardListRes.data

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
