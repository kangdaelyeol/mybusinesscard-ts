import { useContext, useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { updateCardProfileStyle } from '@/store/cardsSlice'
import { CARD_ACTIONS } from '@/reducer'
import { cardClient } from '@/client'
import { EVENT_TYPES, PubSubContext, CardContext } from '@/context'

export default function useCardDisplay(card) {
    const { subscribe, unSubscribe } = useContext(PubSubContext)

    const userState = useSelector((state) => state.user)

    const [editPicture, setEditPicture] = useState(false)

    useEffect(() => {
        const hideEditPicture = () => {
            setEditPicture(false)
        }

        subscribe(EVENT_TYPES.HIDE_IMAGE_STYLING, hideEditPicture)
        return () => {
            unSubscribe(EVENT_TYPES.HIDE_IMAGE_STYLING, hideEditPicture)
        }
    }, [])

    let data, saveProfileStyle

    if (!card) {
        const { cardState, cardDispatch } = useContext(CardContext)
        data = cardState
        saveProfileStyle = (style) => {
            cardDispatch({
                type: CARD_ACTIONS.UPDATE_PROFILE_STYLE,
                payload: { style },
            })
            setEditPicture(false)
        }
    } else {
        data = card
        const dispatch = useDispatch()
        saveProfileStyle = (style) => {
            dispatch(updateCardProfileStyle({ id: data.id, value: style }))
            cardClient.updateProfileStyle(userState.username, data.id, style)
            setEditPicture(false)
        }
    }

    const handlePictureEdit = () => {
        setEditPicture(true)
    }

    return {
        data,
        saveProfileStyle,
        editPicture,
        handlePictureEdit,
    }
}
