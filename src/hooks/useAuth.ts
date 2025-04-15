import { RootState } from './../store/index'
import { useDispatch, useSelector } from 'react-redux'
import { authGuard, jwtUtil } from '@/auth'
import { clearUser } from '@/store/user-slice'
import { clearCards } from '@/store/cards-slice'
import { useNavigate } from 'react-router-dom'
import { useContext } from 'react'
import { ToasterMessageContext } from '@/context'

export const useAuth = () => {
    const dispatch = useDispatch()
    const navigate = useNavigate()
    const { setToasterMessageTimeOut } = useContext(ToasterMessageContext)
    const userState = useSelector((state: RootState) => state.user)

    const authenticateTokenAndUser = async () => {
        const isAuthenticated = await authGuard.verifyTokenAndUsername(
            userState.username,
        )
        if (!isAuthenticated) {
            dispatch(clearUser())
            dispatch(clearCards())
            jwtUtil.deleteToken()
            setToasterMessageTimeOut('Failed to verify token and user')
            navigate('/')
        }
    }

    return authenticateTokenAndUser
}
