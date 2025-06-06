import { ChangeEvent, useContext, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { CARD_ACTIONS } from '@/reducer'
import { createCard } from '@/store/cards-slice'
import { cardFactory, CardTheme } from '@/models'
import { CardContext, ToasterMessageContext, PubSubContext } from '@/context'
import { PUBSUB_EVENT_TYPES } from '@/context/types'
import { cardService, cloudinaryService } from '@/services'
import { RootState } from '@/store'
import { useAuth } from '@/hooks/useAuth'

export const useCardMaker = () => {
    const { publish } = useContext(PubSubContext)
    const { cardState, cardDispatch } = useContext(CardContext)
    const { setToasterMessageTimeOut } = useContext(ToasterMessageContext)
    const userState = useSelector((state: RootState) => state.user)
    const checkAuth = useAuth()

    const dispatch = useDispatch()

    const [fileLoading, setFileLoading] = useState<boolean>(false)

    const handlers = {
        descriptionChange: (e: ChangeEvent<HTMLTextAreaElement>) => {
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

        themeChange: (e: ChangeEvent<HTMLSelectElement>) => {
            publish(PUBSUB_EVENT_TYPES.HIDE_PROFILE_DETAIL)
            cardDispatch({
                type: CARD_ACTIONS.UPDATE_THEME,
                payload: { theme: e.target.value as CardTheme },
            })
        },

        fileInput: async (e: ChangeEvent<HTMLInputElement>) => {
            if (!(await checkAuth())) return
            if (!e.target.files || e.target.files.length === 0) return

            setFileLoading(true)

            const uploadImageRes = await cloudinaryService.uploadImage(
                e.target.files[0],
            )

            if (!uploadImageRes.ok) {
                setFileLoading(false)
                setToasterMessageTimeOut('Error - Failed to upload image')
                return
            }

            if (cardState.profile.assetId) {
                const deleteImageRes = await cloudinaryService.deleteImage(
                    cardState.profile.assetId,
                    cardState.profile.publicId,
                )

                if (!deleteImageRes.ok) {
                    setToasterMessageTimeOut('Error - Failed to delete image')
                }
            }

            if (!uploadImageRes.data) {
                setFileLoading(false)
                throw new Error('Type error - upload image')
            }

            const { url, asset_id, public_id, width, height } =
                uploadImageRes.data

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
            if (!(await checkAuth())) return
            if (fileLoading) return

            const cardID = Date.now().toString()

            const newCard = cardFactory.createCard({
                ...cardState,
                id: cardID,
                createdAt: new Date().toISOString(),
                createdBy: userState.username,
            })

            const createCardRes = await cardService.create(newCard)
            if (!createCardRes.ok) {
                setToasterMessageTimeOut('Failed to create card')
                return
            }

            if (!createCardRes.data) {
                throw new Error('Type error - create card')
            }

            dispatch(createCard({ card: createCardRes.data }))
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
