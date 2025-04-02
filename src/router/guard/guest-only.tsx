import { useEffect, ReactNode, useContext } from 'react'
import { useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { initCards } from '@/store/cards-slice'
import { setUser } from '@/store/user-slice'
import { AppDispatch, RootState } from '@/store'
import { authHelper } from '@/helpers'
import { userFacade } from '@/facade'
import { ToasterMessageContext } from '@/context'

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
            if (userState.username) {
                navigate('/')
                return
            }

            const storageUsername = authHelper.getLocalStorageUsername()

            if (!storageUsername) {
                navigate('/')
                return
            }

            const getUserWithCardListRes = await userFacade.getUserWithCardList(
                storageUsername,
            )

            if (!getUserWithCardListRes.ok) {
                setToasterMessageTimeOut('Failed to load user and card data')
                authHelper.removeLocalStorageUsername()
                navigate('/')
                return
            }

            const { cardList, user } = getUserWithCardListRes

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
