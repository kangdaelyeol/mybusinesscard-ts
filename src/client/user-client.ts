import { ref, set, get, remove } from 'firebase/database'
import { userFactory } from '@/factory'
import { db } from '@/service/firebase'
import { User, UserProfile, UserProfileStyle } from '@/models/user-model'
import { validation } from '@/client/validate'
import { UserClientResponse, UserGetResponse } from '@/client/types'

export const userClient = {
    get: async (username: string): Promise<UserGetResponse> => {
        const userRef = ref(db, `users/${username}`)
        const snapshot = await get(userRef)
        if (!snapshot.exists()) {
            return {
                status: 400,
                reason: "User doesn't exist!",
            }
        }

        const userData: User = snapshot.val()

        return {
            status: 200,
            data: userData,
        }
    },

    create: async (
        username: string,
        nickname: string,
        password: string,
        confirmPassword: string,
    ): Promise<UserGetResponse> => {
        const validateUsernameRes = validation.username(username)

        if (validateUsernameRes.isValid === false) {
            return {
                status: 400,
                reason: validateUsernameRes.reason,
            }
        }

        const validateNicknameRes = validation.nickname(nickname)

        if (validateNicknameRes.isValid === false) {
            return {
                status: 400,
                reason: validateNicknameRes.reason,
            }
        }

        const validatePasswordRes = validation.password(password)

        if (validatePasswordRes.isValid === false) {
            return {
                status: 400,
                reason: validatePasswordRes.reason,
            }
        }

        if (password !== confirmPassword) {
            return {
                status: 400,
                reason: "Password doesn't match confirm password correctly.\nPlease check your password again",
            }
        }

        try {
            const userRef = ref(db, `/users/${username}`)
            const snapshot = await get(userRef)

            if (snapshot.exists()) {
                return { status: 400, reason: 'Username already exists.' }
            }

            const newUser = userFactory.createUser({
                username,
                nickname,
                password,
            })

            await set(userRef, newUser)

            return {
                status: 200,
                data: newUser,
            }
        } catch (e) {
            console.error(e)
            return { status: 400, reason: 'Failed to request API - createUser' }
        }
    },

    remove: async (username: string): Promise<UserClientResponse> => {
        const userRef = ref(db, `/users/${username}`)
        try {
            await remove(userRef)

            return {
                status: 200,
            }
        } catch (e) {
            console.error(e)
            return {
                status: 400,
                reason: 'Failed to request API - removeUser',
            }
        }
    },

    updateProfile: async (
        username: string,
        profile: UserProfile,
    ): Promise<UserClientResponse> => {
        const userProfileRef = ref(db, `users/${username}/profile`)

        try {
            await set(userProfileRef, profile)
            return {
                status: 200,
            }
        } catch (e) {
            console.error(e)
            return {
                status: 400,
                reason: 'Failed to request API - updateUserProfile',
            }
        }
    },

    updateProfileStyle: async (
        username: string,
        style: UserProfileStyle,
    ): Promise<UserClientResponse> => {
        const userProfileStyleRef = ref(db, `users/${username}/profile/style`)
        try {
            await set(userProfileStyleRef, style)
            return {
                status: 200,
            }
        } catch (e) {
            console.error(e)
            return {
                status: 400,
                reason: 'failed to request API - updateUserProfileStyle',
            }
        }
    },

    updateNickname: async (
        username: string,
        nickname: string,
    ): Promise<UserClientResponse> => {
        const validateNicknameRes = validation.nickname(nickname)

        if (validateNicknameRes.isValid === false) {
            return {
                status: 400,
                reason: "Nickname should have 2 to 20 characters, shouldn't contain blank(nbsp) and special symbols.",
            }
        }

        const userNicknameRef = ref(db, `users/${username}/nickname`)
        try {
            await set(userNicknameRef, nickname)
            return {
                status: 200,
            }
        } catch (e) {
            console.error(e)
            return {
                status: 400,
                reason: 'Failed to request API - updateUserNickname',
            }
        }
    },
}
