import { useContext, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { imageClient, cardClient } from '@/client'
import { cardFactory } from '@/factory'
import { ToasterMessageContext, PubSubContext, EVENT_TYPES } from '@/context'
import {
    updateCardDescription,
    updateCardName,
    updateCardTheme,
    deleteCard,
    updateCardProfile,
} from '@/store/cardsSlice'

export default function useCardEditor(card) {
    const { publish } = useContext(PubSubContext)
    const { setToasterMessageTimeOut } = useContext(ToasterMessageContext)

    const userState = useSelector((state) => state.user)
    const dispatch = useDispatch()

    const [fileLoading, setFileLoading] = useState(false)

    const handlers = {
        profileChange: async (e) => {
            setFileLoading(true)

            const cloudinaryRes = await imageClient.uploadInCloudinary(
                e.target.files[0],
            )

            if (cloudinaryRes.status !== 200) {
                setFileLoading(false)
                console.log(
                    'Error - uploadInCloudinary: ',
                    cloudinaryRes.message,
                )
                return
            }

            const { url, asset_id, public_id, width, height } =
                cloudinaryRes.data

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
                userState.username,
                card.id,
                newProfile,
            )

            if (firebaseRes.status !== 200) {
                console.log('Error - uploadInFirebase: ', firebaseRes.reason)
                imageClient.deleteInCloudinary(asset_id, public_id)
                setFileLoading(false)
                return
            }
            if (card.profile.url) {
                imageClient.deleteInCloudinary(card.assetId, card.publicId)
            }

            dispatch(updateCardProfile({ id: card.id, value: newProfile }))
            setFileLoading(false)
        },

        nameChange: (e) => {
            publish(EVENT_TYPES.HIDE_PROFILE_DETAIL)
            cardClient.updateName(userState.username, card.id, e.target.value)
            dispatch(updateCardName({ id: card.id, value: e.target.value }))
        },

        descriptionChange: (e) => {
            publish(EVENT_TYPES.HIDE_PROFILE_DETAIL)
            cardClient.updateDescription(
                userState.username,
                card.id,
                e.target.value,
            )
            dispatch(
                updateCardDescription({ id: card.id, value: e.target.value }),
            )
        },

        themeChange: (e) => {
            publish(EVENT_TYPES.HIDE_PROFILE_DETAIL)
            cardClient.updateTheme(userState.username, card.id, e.target.value)
            dispatch(updateCardTheme({ id: card.id, value: e.target.value }))
        },

        cardDelete: () => {
            publish(EVENT_TYPES.HIDE_PROFILE_DETAIL)
            if (fileLoading) return
            cardClient.remove(userState.username, card.id)
            dispatch(deleteCard({ id: card.id }))
            setToasterMessageTimeOut('Card has been deleted successfully!!')
        },
    }

    return {
        handlers,
        fileLoading,
    }
}
