import { ChangeEvent, useContext, useState } from 'react'
import { useDispatch } from 'react-redux'
import { cardClient } from '@/client'
import { ToasterMessageContext, PubSubContext } from '@/context'
import { Card, cardFactory, CardTheme } from '@/models'
import {
    updateCardDescription,
    updateCardName,
    updateCardTheme,
    deleteCard,
    updateCardProfile,
} from '@/store/cards-slice'
import { PUBSUB_EVENT_TYPES } from '@/context/types'
import { cloudinaryService } from '@/services'

export const useCardEditor = (card: Card) => {
    const { publish } = useContext(PubSubContext)
    const { setToasterMessageTimeOut } = useContext(ToasterMessageContext)

    const dispatch = useDispatch()

    const [fileLoading, setFileLoading] = useState<boolean>(false)

    const handlers = {
        profileChange: async (e: ChangeEvent<HTMLInputElement>) => {
            if (!e.target.files || e.target.files.length === 0) return

            setFileLoading(true)
            const uploadedImage = await cloudinaryService.uploadImage(
                e.target.files[0],
            )

            if (!uploadedImage) {
                setToasterMessageTimeOut('Failed to upload image')
                setFileLoading(false)
                return
            }

            const { url, asset_id, public_id, width, height } = uploadedImage

            const newProfile = cardFactory.createCardProfile({
                url,
                assetId: asset_id,
                publicId: public_id,
                style: {
                    width,
                    height,
                },
            })

            const firebaseRes = await cardClient.updateProfile(
                card.id,
                newProfile,
            )

            if (firebaseRes.status !== 200 && 'reason' in firebaseRes) {
                console.log('Error - uploadInFirebase: ', firebaseRes.reason)
                cloudinaryService.deleteImage(asset_id, public_id)
                setFileLoading(false)
                return
            }

            if (card.profile.assetId) {
                cloudinaryService.deleteImage(
                    card.profile.assetId,
                    card.profile.publicId,
                )
            }

            dispatch(updateCardProfile({ id: card.id, value: newProfile }))
            setFileLoading(false)
        },

        nameChange: (e: ChangeEvent<HTMLInputElement>) => {
            publish(PUBSUB_EVENT_TYPES.HIDE_PROFILE_DETAIL)
            cardClient.updateName(card.id, e.target.value)
            dispatch(updateCardName({ id: card.id, value: e.target.value }))
        },

        descriptionChange: (e: ChangeEvent<HTMLInputElement>) => {
            publish(PUBSUB_EVENT_TYPES.HIDE_PROFILE_DETAIL)
            cardClient.updateDescription(card.id, e.target.value)
            dispatch(
                updateCardDescription({ id: card.id, value: e.target.value }),
            )
        },

        themeChange: (e: ChangeEvent<HTMLInputElement>) => {
            publish(PUBSUB_EVENT_TYPES.HIDE_PROFILE_DETAIL)
            cardClient.updateTheme(card.id, e.target.value)
            dispatch(
                updateCardTheme({
                    id: card.id,
                    value: e.target.value as CardTheme,
                }),
            )
        },

        cardDelete: () => {
            publish(PUBSUB_EVENT_TYPES.HIDE_PROFILE_DETAIL)
            if (fileLoading) return
            cardClient.remove(card.id)
            dispatch(deleteCard({ id: card.id }))
            setToasterMessageTimeOut('Card has been deleted successfully!!')
        },
    }

    return {
        handlers,
        fileLoading,
    }
}
