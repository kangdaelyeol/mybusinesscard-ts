import { ChangeEvent, useContext, useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { imageClient, userClient } from '@/client'
import { userFactory, UserProfileStyle } from '@/models'
import { LOCALSTORAGE_TOKEN_NAME } from '@/constants'
import { PubSubContext, ToasterMessageContext } from '@/context'
import { clearCards } from '@/store/cards-slice'
import {
    clearUser,
    updateUserProfile,
    updateUserProfileStyle,
} from '@/store/user-slice'
import { RootState } from '@/store'
import { PUBSUB_EVENT_TYPES } from '@/context/types'

export const useProfileDetail = () => {
    const { subscribe, unSubscribe, publish } = useContext(PubSubContext)
    const { setToasterMessageTimeOut } = useContext(ToasterMessageContext)

    const userState = useSelector((state: RootState) => state.user)
    const dispatch = useDispatch()

    const [imageStyling, setImageStyling] = useState(false)
    const [imageOption, setImageOption] = useState(false)
    const [fileLoading, setFileLoading] = useState(false)

    const fileInputRef = useRef<HTMLInputElement>(null)
    const navigate = useNavigate()

    useEffect(() => {
        const hideImageStyling = () => {
            setImageStyling(false)
        }
        subscribe(PUBSUB_EVENT_TYPES.HIDE_IMAGE_STYLING, hideImageStyling)
        return () => {
            unSubscribe(PUBSUB_EVENT_TYPES.HIDE_IMAGE_STYLING, hideImageStyling)
        }
    }, [])

    const saveProfileStyle = async (style: UserProfileStyle) => {
        const updateProfileStyleRes = await userClient.updateProfileStyle(
            userState.username,
            style,
        )
        if (
            updateProfileStyleRes.status !== 200 &&
            'reason' in updateProfileStyleRes
        ) {
            console.error(
                `Error - updateUserProfileStyle: ${updateProfileStyleRes.reason}`,
            )
            setImageStyling(false)
            setImageOption(false)
            return
        }
        setToasterMessageTimeOut('Profile style has changed successfully!!')
        dispatch(updateUserProfileStyle({ style }))
        setImageStyling(false)
        setImageOption(false)
    }

    const handlers = {
        editPositionClick: () => {
            setImageStyling(true)
        },

        editProfileClick: () => {
            setImageOption((prev) => !prev)
        },

        fileInput: async (e: ChangeEvent<HTMLInputElement>) => {
            if (!e.target.files || e.target.files.length === 0) return

            setFileLoading(true)
            const uploadImageRes = await imageClient.uploadInCloudinary(
                e.target.files[0],
            )

            if (uploadImageRes.status === 200 && 'data' in uploadImageRes) {
                const { url, asset_id, public_id, width, height } =
                    uploadImageRes.data

                const newProfile = userFactory.createUserProfile({
                    url,
                    assetId: asset_id,
                    publicId: public_id,
                    style: {
                        width,
                        height,
                    },
                })

                const firebaseRes = await userClient.updateProfile(
                    userState.username,
                    newProfile,
                )

                if (firebaseRes.status !== 200 && 'reason' in firebaseRes) {
                    console.error(
                        'Error - uploadInFirebase: ',
                        firebaseRes.reason,
                    )
                    await imageClient.deleteInCloudinary(
                        newProfile.assetId,
                        newProfile.publicId,
                    )
                    setFileLoading(false)
                    return
                }

                if (userState.profile.url) {
                    await imageClient.deleteInCloudinary(
                        userState.profile.assetId,
                        userState.profile.publicId,
                    )
                }

                dispatch(updateUserProfile({ profile: newProfile }))

                setFileLoading(false)
                setImageStyling(true)
            } else if (
                uploadImageRes.status !== 200 &&
                'reason' in uploadImageRes
            ) {
                console.error(
                    `Error - UploadCloudinaryImage: ${uploadImageRes.reason}`,
                )
                setFileLoading(false)
                return
            }
        },

        newFileClick: () => {
            if (fileInputRef.current) {
                fileInputRef.current.click()
            }
        },

        manageAccountClick: () => {
            publish(PUBSUB_EVENT_TYPES.HIDE_PROFILE_DETAIL)
            navigate('/account')
        },

        logoutClick: () => {
            localStorage.removeItem(LOCALSTORAGE_TOKEN_NAME)
            publish(PUBSUB_EVENT_TYPES.HIDE_PROFILE_DETAIL)
            dispatch(clearUser())
            dispatch(clearCards())
            setToasterMessageTimeOut('Logged out successfully!!')
            navigate('/login')
        },
    }

    return {
        fileInputRef,
        handlers,
        saveProfileStyle,
        userState,
        imageStyling,
        imageOption,
        fileLoading,
    }
}
