import { Dispatch, useContext, useState } from 'react'
import { PubSubContext } from '@/context'
import { PUBSUB_EVENT_TYPES } from '@/context/types'
import { CardStyle, UserProfileStyle } from '@/models'

export const useAvatarSizing = (
    style: UserProfileStyle | CardStyle,
    saveProfileStyle: Dispatch<UserProfileStyle | CardStyle>,
) => {
    const { publish } = useContext(PubSubContext)

    const [imgStyle, setStyle] = useState({ ...style })

    const setScaleRate = (value: number) => {
        setStyle((prev) => ({ ...prev, scale: value }))
    }

    const setRoundedRate = (value: number) => {
        setStyle((prev) => ({ ...prev, rounded: value }))
    }

    const setTransXRate = (value: number) => {
        setStyle((prev) => ({ ...prev, transX: value }))
    }

    const setTransYRate = (value: number) => {
        setStyle((prev) => ({ ...prev, transY: value }))
    }

    const handleStyleSave = () => {
        saveProfileStyle({
            ...imgStyle,
        })
    }

    const handleExitClick = () => {
        publish(PUBSUB_EVENT_TYPES.HIDE_IMAGE_STYLING)
    }

    return {
        imgStyle,
        setScaleRate,
        setRoundedRate,
        setTransXRate,
        setTransYRate,
        handleStyleSave,
        handleExitClick,
    }
}
