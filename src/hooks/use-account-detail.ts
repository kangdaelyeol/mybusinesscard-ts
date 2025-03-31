import { ChangeEvent, useContext, useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { RootState } from '@/store'
import {
    clearUser,
    updateUserNickname,
    updateUserProfile,
    updateUserProfileStyle,
} from '@/store/user-slice'
import { clearCards } from '@/store/cards-slice'
import { imageClient, userClient } from '@/client'
import { userFactory, UserProfileStyle } from '@/models'
import { PubSubContext, ToasterMessageContext } from '@/context'
import { LOCALSTORAGE_TOKEN_NAME } from '@/constants'
import { PUBSUB_EVENT_TYPES } from '@/context/types'

export const useAccountDetail = () => {
    const { publish, subscribe, unSubscribe } = useContext(PubSubContext)
    const { setToasterMessageTimeOut } = useContext(ToasterMessageContext)

    const userState = useSelector((state: RootState) => state.user)
    const cards = useSelector((state: RootState) => state.cards)
    const dispatch = useDispatch()

    const [fileLoading, setFileLoading] = useState<boolean>(false)
    const [saveLoading, setSaveLoading] = useState<boolean>(false)
    const [deleteAccountLoading, setDeleteAccountLoading] =
        useState<boolean>(false)
    const [profileOption, setProfileOption] = useState<boolean>(false)
    const [profileStyling, setProfileStyling] = useState<boolean>(false)
    const [errorMessage, setErrorMessage] = useState<string>('')
    const [nickname, setNickname] = useState<string>(userState.nickname)
    const [deleteAccountModal, setDeleteAccountModal] = useState<boolean>(false)

    const fileInputRef = useRef<HTMLInputElement | null>(null)

    const navigate = useNavigate()

    useEffect(() => {
        const hideProfileStyling = () => {
            setProfileStyling(false)
        }

        subscribe(PUBSUB_EVENT_TYPES.HIDE_IMAGE_STYLING, hideProfileStyling)

        return () => {
            unSubscribe(
                PUBSUB_EVENT_TYPES.HIDE_IMAGE_STYLING,
                hideProfileStyling,
            )
        }
    }, [])

    const saveProfileStyle = async (style: UserProfileStyle) => {
        publish(PUBSUB_EVENT_TYPES.HIDE_PROFILE_DETAIL)
        const updateProfileRes = await userClient.updateProfileStyle(
            userState.username,
            style,
        )
        if (updateProfileRes.status !== 200) {
            setProfileStyling(false)
            setProfileOption(false)
            return
        }
        dispatch(updateUserProfileStyle({ style }))
        setProfileStyling(false)
        setProfileOption(false)
    }

    const handlers = {
        nicknameChange: (e: ChangeEvent<HTMLInputElement>) => {
            publish(PUBSUB_EVENT_TYPES.HIDE_PROFILE_DETAIL)
            setErrorMessage('')
            setNickname(e.target.value)
        },

        editProfileClick: () => {
            publish(PUBSUB_EVENT_TYPES.HIDE_PROFILE_DETAIL)
            setProfileOption((prev) => !prev)
        },

        editPositionClick: () => {
            publish(PUBSUB_EVENT_TYPES.HIDE_PROFILE_DETAIL)
            setProfileStyling(true)
        },

        newFileClick: () => {
            fileInputRef.current?.click()
        },

        fileInput: async (e: ChangeEvent<HTMLInputElement>) => {
            if (!e.target.files?.length) return

            publish(PUBSUB_EVENT_TYPES.HIDE_PROFILE_DETAIL)
            setFileLoading(true)

            const cloudinaryRes = await imageClient.uploadInCloudinary(
                e.target.files[0],
            )

            if (cloudinaryRes.status === 200 && 'data' in cloudinaryRes) {
                const { url, asset_id, public_id, width, height } =
                    cloudinaryRes.data

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
                    imageClient.deleteInCloudinary(
                        newProfile.assetId,
                        newProfile.publicId,
                    )
                    setToasterMessageTimeOut(
                        `Unexpected Error: ${firebaseRes.reason}`,
                    )

                    setFileLoading(false)
                    return
                }

                if (userState.profile.assetId) {
                    imageClient.deleteInCloudinary(
                        userState.profile.assetId,
                        userState.profile.publicId,
                    )
                }

                dispatch(updateUserProfile({ profile: newProfile }))
                setFileLoading(false)
                setToasterMessageTimeOut(
                    'Your account image has been updated successfully!!',
                )
                setProfileStyling(true)
            } else if (cloudinaryRes.status !== 200) {
                setFileLoading(false)
                return
            }
        },

        saveButtonClick: async () => {
            publish(PUBSUB_EVENT_TYPES.HIDE_PROFILE_DETAIL)
            setSaveLoading(true)

            const updateNicknameRes = await userClient.updateNickname(
                userState.username,
                nickname,
            )

            if (
                updateNicknameRes.status !== 200 &&
                'reason' in updateNicknameRes
            ) {
                setErrorMessage(updateNicknameRes.reason)
                setSaveLoading(false)
                return
            }

            setSaveLoading(false)
            dispatch(updateUserNickname({ nickname }))
            setToasterMessageTimeOut(
                'Your account info has been updated successfully!!',
            )
            navigate('/')
        },

        changePasswordClick: () => {
            publish(PUBSUB_EVENT_TYPES.HIDE_PROFILE_DETAIL)
            navigate('/change-password')
        },

        deleteAccountClick: () => {
            setDeleteAccountModal(true)
        },

        deleteAccountCancelClick: () => {
            setDeleteAccountModal(false)
        },

        deleteAccountInModalClick: async () => {
            if (deleteAccountLoading) return

            setDeleteAccountLoading(true)
            const removeUserRes = await userClient.remove(userState.username)

            await Promise.allSettled(
                cards.map((card) => {
                    return imageClient.deleteInCloudinary(
                        card.profile.assetId,
                        card.profile.publicId,
                    )
                }),
            )

            if (removeUserRes.status === 200) {
                localStorage.removeItem(LOCALSTORAGE_TOKEN_NAME)
                publish(PUBSUB_EVENT_TYPES.HIDE_PROFILE_DETAIL)
                dispatch(clearUser())
                dispatch(clearCards())
                setToasterMessageTimeOut('Account is removed successfully!!')
                navigate('/login')
            } else if (
                removeUserRes.status !== 200 &&
                'reason' in removeUserRes
            ) {
                setToasterMessageTimeOut(
                    `failed - remove account: ${removeUserRes.reason}`,
                )
                setDeleteAccountLoading(false)
            }
        },
    }

    return {
        fileLoading,
        profileOption,
        profileStyling,
        nickname,
        handlers,
        saveProfileStyle,
        fileInputRef,
        userState,
        saveLoading,
        errorMessage,
        deleteAccountModal,
        deleteAccountLoading,
    }
}
