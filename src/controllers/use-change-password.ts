import { ChangeEvent, useContext, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { ToasterMessageContext, PubSubContext } from '@/context'
import { RootState } from '@/store'
import { PUBSUB_EVENT_TYPES } from '@/context/types'
import { authService } from '@/services/auth-service'
import { useAuth } from '@/hooks/useAuth'

export const useChangePassword = () => {
    const { publish } = useContext(PubSubContext)
    const { setToasterMessageTimeOut } = useContext(ToasterMessageContext)

    const userState = useSelector((state: RootState) => state.user)
    const checkAuth = useAuth()

    const [errorMessage, setErrorMessage] = useState<string>('')
    const [saveLoading, setSaveLoading] = useState<boolean>(false)
    const [passwordState, setPasswordState] = useState({
        current: '',
        new: '',
        confirm: '',
    })

    const navigate = useNavigate()

    const handlers = {
        currentPasswordChange: (e: ChangeEvent<HTMLInputElement>) => {
            publish(PUBSUB_EVENT_TYPES.HIDE_PROFILE_DETAIL)
            setErrorMessage('')
            setPasswordState((prev) => ({ ...prev, current: e.target.value }))
        },

        newPasswordChange: (e: ChangeEvent<HTMLInputElement>) => {
            publish(PUBSUB_EVENT_TYPES.HIDE_PROFILE_DETAIL)
            setErrorMessage('')
            setPasswordState((prev) => ({ ...prev, new: e.target.value }))
        },

        confirmPasswordChange: (e: ChangeEvent<HTMLInputElement>) => {
            publish(PUBSUB_EVENT_TYPES.HIDE_PROFILE_DETAIL)
            setErrorMessage('')
            setPasswordState((prev) => ({ ...prev, confirm: e.target.value }))
        },

        saveButtonClick: async () => {
            await checkAuth()
            publish(PUBSUB_EVENT_TYPES.HIDE_PROFILE_DETAIL)
            setSaveLoading(true)

            const changePasswordRes = await authService.changePassword(
                userState.username,
                passwordState.current,
                passwordState.new,
                passwordState.confirm,
            )

            if (
                !changePasswordRes.ok &&
                typeof changePasswordRes.reason === 'string'
            ) {
                setErrorMessage(changePasswordRes.reason)
                setSaveLoading(false)
                return
            }

            navigate('/')
            setSaveLoading(false)
            setToasterMessageTimeOut('Password has been changed successfully!!')
        },

        accountSettingsClick: () => {
            navigate('/account')
        },
    }

    return { handlers, saveLoading, errorMessage, passwordState }
}
