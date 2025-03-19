import { useContext, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { PubSubContext, EVENT_TYPES } from '@/context'
export default function useHeader() {
    const { subscribe, unSubscribe, publish } = useContext(PubSubContext)

    const userState = useSelector((state) => state.user)

    const [profileDetail, setProfileDetail] = useState(false)

    useEffect(() => {
        const hideProfileDetail = () => {
            setProfileDetail(false)
        }

        subscribe(EVENT_TYPES.HIDE_PROFILE_DETAIL, hideProfileDetail)
        return () => {
            unSubscribe(EVENT_TYPES.HIDE_PROFILE_DETAIL, hideProfileDetail)
        }
    }, [])

    const navigate = useNavigate()

    const handleProfileClick = () => {
        if (!userState.username) return
        setProfileDetail((prev) => !prev)
    }

    const handleTitleClick = () => {
        navigate('/')
        publish(EVENT_TYPES.HIDE_PROFILE_DETAIL)
    }

    return {
        profileDetail,
        handleProfileClick,
        userState,
        handleTitleClick,
    }
}
