import { useContext, useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Card, CardStyle } from '@/models'
import { CARD_ACTIONS } from '@/reducer'
import { PubSubContext, CardContext, ToasterMessageContext } from '@/context'
import { PUBSUB_EVENT_TYPES } from '@/context/types'
import { updateCardProfileStyle } from '@/store/cards-slice'
import { cardService } from '@/services'
import { RootState } from '@/store'

export const useCardDisplay = (card?: Card) => {
    const { subscribe, unSubscribe } = useContext(PubSubContext)
    const { setToasterMessageTimeOut } = useContext(ToasterMessageContext)
    const [editPicture, setEditPicture] = useState<boolean>(false)

    const userState = useSelector((state: RootState) => state.user)

    useEffect(() => {
        const hideEditPicture = () => {
            setEditPicture(false)
        }

        subscribe(PUBSUB_EVENT_TYPES.HIDE_IMAGE_STYLING, hideEditPicture)
        return () => {
            unSubscribe(PUBSUB_EVENT_TYPES.HIDE_IMAGE_STYLING, hideEditPicture)
        }
    }, [])

    let data: Card, saveProfileStyle

    if (!card) {
        const { cardState, cardDispatch } = useContext(CardContext)
        data = cardState
        saveProfileStyle = (style: CardStyle) => {
            cardDispatch({
                type: CARD_ACTIONS.UPDATE_PROFILE_STYLE,
                payload: { style },
            })
            setEditPicture(false)
        }
    } else {
        data = card
        const dispatch = useDispatch()
        saveProfileStyle = (style: CardStyle) => {
            dispatch(updateCardProfileStyle({ id: data.id, value: style }))
            cardService
                .updateProfileStyle(data.id, style, userState.username)
                .then((res) => {
                    if (!res.ok) {
                        setToasterMessageTimeOut(
                            'Failed to update card profile style',
                        )
                    }
                })
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
