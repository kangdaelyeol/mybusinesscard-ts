import { ChangeEvent, useContext, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
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
import { cardService, cloudinaryService } from '@/services'
import { RootState } from '@/store'

export const useCardEditor = (card: Card) => {
    const { publish } = useContext(PubSubContext)
    const { setToasterMessageTimeOut } = useContext(ToasterMessageContext)

    const userState = useSelector((state: RootState) => state.user)

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

            const updatedProfile = await cardService.updateProfile(
                card.id,
                newProfile,
                userState.username,
            )

            if (!updatedProfile.ok) {
                setToasterMessageTimeOut('Failed to update profile')
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
            cardService.updateName(card.id, e.target.value).then((res) => {
                if (!res.ok)
                    setToasterMessageTimeOut('Failed to change card name')
            })
            dispatch(updateCardName({ id: card.id, value: e.target.value }))
        },

        descriptionChange: (e: ChangeEvent<HTMLTextAreaElement>) => {
            publish(PUBSUB_EVENT_TYPES.HIDE_PROFILE_DETAIL)
            cardService
                .updateDescription(card.id, e.target.value)
                .then((res) => {
                    if (!res.ok)
                        setToasterMessageTimeOut(
                            'Failed to change card description',
                        )
                })
            dispatch(
                updateCardDescription({ id: card.id, value: e.target.value }),
            )
        },

        themeChange: (e: ChangeEvent<HTMLSelectElement>) => {
            publish(PUBSUB_EVENT_TYPES.HIDE_PROFILE_DETAIL)
            const theme = e.target.value as CardTheme
            cardService.updateTheme(card.id, theme).then((res) => {
                if (!res.ok)
                    setToasterMessageTimeOut('Failed to change card theme')
            })
            dispatch(
                updateCardTheme({
                    id: card.id,
                    value: theme,
                }),
            )
        },

        cardDelete: () => {
            publish(PUBSUB_EVENT_TYPES.HIDE_PROFILE_DETAIL)
            if (fileLoading) return
            cardService.delete(card.id, userState.username).then((res) => {
                if (!res.ok) setToasterMessageTimeOut('Failed to delete card')
            })
            dispatch(deleteCard({ id: card.id }))
            setToasterMessageTimeOut('Card has been deleted successfully!!')
        },
    }

    return {
        handlers,
        fileLoading,
    }
}
