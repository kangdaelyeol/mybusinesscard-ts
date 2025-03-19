import { useContext, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { authClient } from '@/client'
import { ToasterMessageContext, EVENT_TYPES, PubSubContext } from '@/context'

const useChangePassword = () => {
    const { publish } = useContext(PubSubContext)
    const { setToasterMessageTimeOut } = useContext(ToasterMessageContext)

    const userState = useSelector((state) => state.user)

    const [errorMessage, setErrorMessage] = useState()
    const [saveLoading, setSaveLoading] = useState(false)
    const [passwordState, setPasswordState] = useState({
        current: '',
        new: '',
        confirm: '',
    })

    const navigate = useNavigate()

    const handlers = {
        currentPasswordChange: (e) => {
            publish(EVENT_TYPES.HIDE_PROFILE_DETAIL)
            setErrorMessage('')
            setPasswordState((prev) => ({ ...prev, current: e.target.value }))
        },

        newPasswordChange: (e) => {
            publish(EVENT_TYPES.HIDE_PROFILE_DETAIL)
            setErrorMessage('')
            setPasswordState((prev) => ({ ...prev, new: e.target.value }))
        },

        confirmPasswordChange: (e) => {
            publish(EVENT_TYPES.HIDE_PROFILE_DETAIL)
            setErrorMessage('')
            setPasswordState((prev) => ({ ...prev, confirm: e.target.value }))
        },

        saveButtonClick: async () => {
            publish(EVENT_TYPES.HIDE_PROFILE_DETAIL)
            setSaveLoading(true)

            const res = await authClient.changePassword(
                userState.username,
                passwordState.current,
                passwordState.new,
                passwordState.confirm,
            )

            if (res.status !== 200) {
                setErrorMessage(res.reason)
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

export default useChangePassword
