import { ChangeEvent, useContext, useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { userFactory, UserProfileStyle } from '@/models'
import { PubSubContext, ToasterMessageContext } from '@/context'
import { clearCards } from '@/store/cards-slice'
import {
    clearUser,
    updateUserProfile,
    updateUserProfileStyle,
} from '@/store/user-slice'
import { RootState } from '@/store'
import { PUBSUB_EVENT_TYPES } from '@/context/types'
import { cloudinaryService, userService, jwtService } from '@/services'

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
        const updatedProfileStyle = await userService.updateProfileStyle(
            userState.username,
            style,
        )
        if (!updatedProfileStyle) {
            setToasterMessageTimeOut('Failed to update Profile style')
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
            const uploadedImage = await cloudinaryService.uploadImage(
                e.target.files[0],
            )

            if (!uploadedImage) {
                setToasterMessageTimeOut('Failed to upload image')
                setFileLoading(false)
                return
            }

            const { url, asset_id, public_id, width, height } = uploadedImage

            const newProfile = userFactory.createUserProfile({
                url,
                assetId: asset_id,
                publicId: public_id,
                style: {
                    width,
                    height,
                },
            })

            const updatedProfile = await userService.updateProfile(
                userState.username,
                newProfile,
            )

            if (!updatedProfile) {
                setToasterMessageTimeOut('Failed to update Profile')
                cloudinaryService.deleteImage(
                    newProfile.assetId,
                    newProfile.publicId,
                )
                setFileLoading(false)
                return
            }

            if (userState.profile.assetId) {
                cloudinaryService.deleteImage(
                    userState.profile.assetId,
                    userState.profile.publicId,
                )
            }

            dispatch(updateUserProfile({ profile: updatedProfile }))

            setFileLoading(false)
            setImageStyling(true)
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
            jwtService.deleteToken()
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
