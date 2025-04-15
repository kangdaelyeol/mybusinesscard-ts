import { ChangeEvent, useContext, useRef, useState } from 'react'
import { useDispatch } from 'react-redux'
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
import { useAuth } from '@/hooks/useAuth'

export const useCardEditor = (card: Card) => {
    const { publish } = useContext(PubSubContext)
    const { setToasterMessageTimeOut } = useContext(ToasterMessageContext)
    const checkAuth = useAuth()

    const dispatch = useDispatch()

    const fileInputRef = useRef<HTMLInputElement>(null)

    const [fileLoading, setFileLoading] = useState<boolean>(false)

    const handlers = {
        fileInputClick: () => {
            if (fileLoading || !fileInputRef.current) return
            fileInputRef && fileInputRef.current.click()
        },
        profileChange: async (e: ChangeEvent<HTMLInputElement>) => {
            if (!(await checkAuth())) return
            if (!e.target.files || e.target.files.length === 0) return
            setFileLoading(true)

            const uploadImageRes = await cloudinaryService.uploadImage(
                e.target.files[0],
            )

            if (!uploadImageRes.ok) {
                setToasterMessageTimeOut('Failed to upload image')
                setFileLoading(false)
                return
            }

            if (!uploadImageRes.data) {
                throw new Error('Type error - uploadImage')
            }

            const { url, asset_id, public_id, width, height } =
                uploadImageRes.data

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

        cardDelete: async () => {
            if (!(await checkAuth())) return
            publish(PUBSUB_EVENT_TYPES.HIDE_PROFILE_DETAIL)
            if (fileLoading) return
            cardService.delete(card.id).then((res) => {
                if (!res.ok) setToasterMessageTimeOut('Failed to delete card')
            })
            dispatch(deleteCard({ id: card.id }))
            setToasterMessageTimeOut('Card has been deleted successfully!!')
        },
    }

    return {
        handlers,
        fileLoading,
        fileInputRef,
    }
}
