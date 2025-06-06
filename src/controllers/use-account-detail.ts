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
import { userFactory, UserProfileStyle } from '@/models'
import { PubSubContext, ToasterMessageContext } from '@/context'
import { PUBSUB_EVENT_TYPES } from '@/context/types'
import { cloudinaryService, userService } from '@/services'
import { jwtUtil } from '@/auth'
import { useAuth } from '@/hooks/useAuth'

export const useAccountDetail = () => {
    const { publish, subscribe, unSubscribe } = useContext(PubSubContext)
    const { setToasterMessageTimeOut } = useContext(ToasterMessageContext)

    const userState = useSelector((state: RootState) => state.user)
    const cards = useSelector((state: RootState) => state.cards)
    const dispatch = useDispatch()
    const checkAuth = useAuth()

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
        import('@/components/change-password')
    }, [])

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

        const updateProfileRes = await userService.updateProfileStyle(
            userState.username,
            style,
        )

        if (!updateProfileRes.ok) {
            setToasterMessageTimeOut('Failed to update profile')
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
            if (fileLoading) return
            fileInputRef.current?.click()
        },

        fileInput: async (e: ChangeEvent<HTMLInputElement>) => {
            if (!(await checkAuth())) return
            if (!e.target.files?.length) return

            publish(PUBSUB_EVENT_TYPES.HIDE_PROFILE_DETAIL)
            setFileLoading(true)

            const uploadImageRes = await cloudinaryService.uploadImage(
                e.target.files[0],
            )

            if (!uploadImageRes.ok) {
                setToasterMessageTimeOut(
                    `Failed to upload image - ${uploadImageRes.reason}`,
                ),
                    setFileLoading(false)
                return
            }

            if (!uploadImageRes.data) {
                setFileLoading(false)
                throw new Error('Type Error - uploadImage')
            }

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

            const updateProfileRes = await userService.updateProfile(
                userState.username,
                newProfile,
            )

            if (!updateProfileRes.ok) {
                cloudinaryService.deleteImage(
                    newProfile.assetId,
                    newProfile.publicId,
                )

                setToasterMessageTimeOut('Failed to update profile')
                setFileLoading(false)
                return
            }

            if (userState.profile.assetId) {
                cloudinaryService.deleteImage(
                    userState.profile.assetId,
                    userState.profile.publicId,
                )
            }

            dispatch(updateUserProfile({ profile: newProfile }))
            setFileLoading(false)
            setToasterMessageTimeOut(
                'Your profile has been updated successfully!!',
            )
            setProfileStyling(true)
        },

        saveButtonClick: async () => {
            if (!(await checkAuth())) return
            if (saveLoading) return

            publish(PUBSUB_EVENT_TYPES.HIDE_PROFILE_DETAIL)
            setSaveLoading(true)

            const updateNicknameRes = await userService.updateNickname(
                userState.username,
                nickname,
            )

            if (!updateNicknameRes.ok) {
                setToasterMessageTimeOut('Failed to update nickname')
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
            if (!(await checkAuth())) return
            if (deleteAccountLoading) return

            setDeleteAccountLoading(true)
            const deleteUserRes = await userService.delete(userState.username)

            if (!deleteUserRes.ok) {
                setToasterMessageTimeOut('Failed to delete user')
                setDeleteAccountLoading(false)
                return
            }

            await Promise.allSettled(
                cards.map((card) => {
                    return cloudinaryService.deleteImage(
                        card.profile.assetId,
                        card.profile.publicId,
                    )
                }),
            )

            publish(PUBSUB_EVENT_TYPES.HIDE_PROFILE_DETAIL)
            jwtUtil.deleteToken()
            dispatch(clearUser())
            dispatch(clearCards())
            setToasterMessageTimeOut('Your account is deleted successfully!!')
            navigate('/login')
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
