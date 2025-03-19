import { useContext, useState } from 'react'
import { CARD_ACTIONS } from '@/reducer'
import { cardClient, imageClient } from '@/client'
import { useDispatch, useSelector } from 'react-redux'
import { createCard } from '@/store/cardsSlice'
import { cardFactory } from '@/factory'
import {
    CardContext,
    ToasterMessageContext,
    PubSubContext,
    EVENT_TYPES,
} from '@/context'

export default function useCardMaker() {
    const { publish } = useContext(PubSubContext)
    const { cardState, cardDispatch } = useContext(CardContext)
    const { setToasterMessageTimeOut } = useContext(ToasterMessageContext)

    const userState = useSelector((state) => state.user)
    const dispatch = useDispatch()

    const [fileLoading, setFileLoading] = useState(false)

    const handlers = {
        descriptionChange: (e) => {
            publish(EVENT_TYPES.HIDE_PROFILE_DETAIL)
            cardDispatch({
                type: CARD_ACTIONS.UPDATE_DESCRIPTION,
                payload: { description: e.target.value },
            })
        },

        nameChange: (e) => {
            publish(EVENT_TYPES.HIDE_PROFILE_DETAIL)
            cardDispatch({
                type: CARD_ACTIONS.UPDATE_NAME,
                payload: { name: e.target.value },
            })
        },

        themeChange: (e) => {
            publish(EVENT_TYPES.HIDE_PROFILE_DETAIL)
            cardDispatch({
                type: CARD_ACTIONS.UPDATE_THEME,
                payload: { theme: e.target.value },
            })
        },

        fileInput: async (e) => {
            setFileLoading(true)

            const res = await imageClient.uploadInCloudinary(e.target.files[0])

            if (res.status !== 200) {
                console.error('Error - uploadInClodinary: ', res.message)
                setFileLoading(false)
                return
            }

            if (cardState.profile.url)
                imageClient.deleteInCloudinary(
                    cardState.profile.assetId,
                    cardState.profile.publicId,
                )

            const { url, asset_id, public_id, width, height } = res.data

            cardDispatch({
                type: CARD_ACTIONS.UPDATE_PROFILE,
                payload: {
                    profile: cardFactory.createCardProfile({
                        url,
                        assetId: asset_id,
                        publicId: public_id,
                        style: {
                            width,
                            height,
                        },
                    }),
                },
            })
            setFileLoading(false)
        },

        cardSave: async () => {
            if (fileLoading) return

            const cardID = Date.now()

            const newCard = cardFactory.createCard({
                ...cardState,
                id: cardID,
            })

            const res = await cardClient.create(userState.username, newCard)
            if (res.status !== 200) {
                console.error('Error - setCard: ', res.reason)
                return
            }

            dispatch(createCard({ card: newCard }))
            cardDispatch({ type: CARD_ACTIONS.CLEAR_CARD })
            setToasterMessageTimeOut('New card has been added successfully!!')
            publish(EVENT_TYPES.HIDE_PROFILE_DETAIL)
            publish(EVENT_TYPES.HIDE_CREATE_CARD)
        },
    }

    return {
        cardState,
        handlers,
        fileLoading,
    }
}
