import { ChangeEvent, useContext, useState } from 'react'
import { useDispatch } from 'react-redux'
import { CARD_ACTIONS } from '@/reducer'
import { cardClient, imageClient } from '@/client'
import { createCard } from '@/store/cards-slice'
import { cardFactory, CardTheme } from '@/models'
import { CardContext, ToasterMessageContext, PubSubContext } from '@/context'
import { PUBSUB_EVENT_TYPES } from '@/context/types'

export const useCardMaker = () => {
    const { publish } = useContext(PubSubContext)
    const { cardState, cardDispatch } = useContext(CardContext)
    const { setToasterMessageTimeOut } = useContext(ToasterMessageContext)

    const dispatch = useDispatch()

    const [fileLoading, setFileLoading] = useState<boolean>(false)

    const handlers = {
        descriptionChange: (e: ChangeEvent<HTMLInputElement>) => {
            publish(PUBSUB_EVENT_TYPES.HIDE_PROFILE_DETAIL)
            cardDispatch({
                type: CARD_ACTIONS.UPDATE_DESCRIPTION,
                payload: { description: e.target.value },
            })
        },

        nameChange: (e: ChangeEvent<HTMLInputElement>) => {
            publish(PUBSUB_EVENT_TYPES.HIDE_PROFILE_DETAIL)
            cardDispatch({
                type: CARD_ACTIONS.UPDATE_NAME,
                payload: { name: e.target.value },
            })
        },

        themeChange: (e: ChangeEvent<HTMLInputElement>) => {
            publish(PUBSUB_EVENT_TYPES.HIDE_PROFILE_DETAIL)
            cardDispatch({
                type: CARD_ACTIONS.UPDATE_THEME,
                payload: { theme: e.target.value as CardTheme },
            })
        },

        fileInput: async (e: ChangeEvent<HTMLInputElement>) => {
            if (!e.target.files || e.target.files.length === 0) return

            setFileLoading(true)

            const uploadInCloudinaryRes = await imageClient.uploadInCloudinary(
                e.target.files[0],
            )

            if (
                uploadInCloudinaryRes.status !== 200 &&
                'reason' in uploadInCloudinaryRes
            ) {
                console.error(
                    `Error - uploadInClodinary: ${uploadInCloudinaryRes.reason}`,
                )
                setFileLoading(false)
                return
            }

            if (cardState.profile.assetId)
                imageClient.deleteInCloudinary(
                    cardState.profile.assetId,
                    cardState.profile.publicId,
                )

            if (
                uploadInCloudinaryRes.status === 200 &&
                'data' in uploadInCloudinaryRes
            ) {
                const { url, asset_id, public_id, width, height } =
                    uploadInCloudinaryRes.data
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
            }

            setFileLoading(false)
        },

        cardSave: async () => {
            if (fileLoading) return

            const cardID = Date.now()

            const newCard = cardFactory.createCard({
                ...cardState,
                id: cardID,
            })

            const createCardRes = await cardClient.create(newCard)
            if (createCardRes.status !== 200 && 'reason' in createCardRes) {
                console.error(`Error - setCard: ${createCardRes.reason}`)
                return
            }

            dispatch(createCard({ card: newCard }))
            cardDispatch({ type: CARD_ACTIONS.CLEAR_CARD })
            setToasterMessageTimeOut('New card has been added successfully!!')
            publish(PUBSUB_EVENT_TYPES.HIDE_PROFILE_DETAIL)
            publish(PUBSUB_EVENT_TYPES.HIDE_CREATE_CARD)
        },
    }

    return {
        cardState,
        handlers,
        fileLoading,
    }
}
