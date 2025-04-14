import { useContext, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { PubSubContext } from '@/context'
import { RootState } from '@/store'
import { PUBSUB_EVENT_TYPES } from '@/context/types'

export const useHeader = () => {
    const { subscribe, unSubscribe, publish } = useContext(PubSubContext)

    const userState = useSelector((state: RootState) => state.user)

    const [profileDetail, setProfileDetail] = useState<boolean>(false)

    useEffect(() => {
        const hideProfileDetail = () => {
            setProfileDetail(false)
        }

        subscribe(PUBSUB_EVENT_TYPES.HIDE_PROFILE_DETAIL, hideProfileDetail)
        return () => {
            unSubscribe(
                PUBSUB_EVENT_TYPES.HIDE_PROFILE_DETAIL,
                hideProfileDetail,
            )
        }
    }, [])

    const navigate = useNavigate()

    const handleProfileClick = () => {
        if (!userState.username) return
        setProfileDetail((prev) => !prev)
    }

    const handleTitleClick = () => {
        navigate('/')
        publish(PUBSUB_EVENT_TYPES.HIDE_PROFILE_DETAIL)
    }

    return {
        profileDetail,
        handleProfileClick,
        userState,
        handleTitleClick,
    }
}
