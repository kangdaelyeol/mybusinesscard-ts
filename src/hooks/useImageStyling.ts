import { useContext, useState } from 'react'
import { EVENT_TYPES, PubSubContext } from '@/context'

export default function useAvatarSizing(style, saveProfileStyle) {
    const { publish } = useContext(PubSubContext)

    const [imgStyle, setStyle] = useState({ ...style })

    const setScaleRate = (value) => {
        setStyle((prev) => ({ ...prev, scale: value }))
    }

    const setRoundedRate = (value) => {
        setStyle((prev) => ({ ...prev, rounded: value }))
    }

    const setTransXRate = (value) => {
        setStyle((prev) => ({ ...prev, transX: value }))
    }

    const setTransYRate = (value) => {
        setStyle((prev) => ({ ...prev, transY: value }))
    }

    const handleStyleSave = () => {
        saveProfileStyle({
            ...imgStyle,
        })
    }

    const handleExitClick = () => {
        publish(EVENT_TYPES.HIDE_IMAGE_STYLING)
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
