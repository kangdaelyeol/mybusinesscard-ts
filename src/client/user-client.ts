import { ref, set, get, remove } from 'firebase/database'
import { db } from '@/config/firebase'
import { User, userFactory, UserProfile, UserProfileStyle } from '@/models'
import { ClientResponse } from '@/client/types'
import { bcryptUtil } from '@/auth'

export const userClient = {
    get: async (username: string): Promise<ClientResponse<User>> => {
        const userRef = ref(db, `users/${username}`)
        try {
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
        } catch (e) {
            console.error(e)
            return {
                status: 500,
                reason: 'Failed to request API - getUser',
            }
        }
    },

    create: async (
        username: string,
        nickname: string,
        password: string,
    ): Promise<ClientResponse<User>> => {
        try {
            const userRef = ref(db, `/users/${username}`)
            const snapshot = await get(userRef)

            if (snapshot.exists()) {
                return { status: 400, reason: 'Username already exists.' }
            }

            const hashedPassword = await bcryptUtil.hash(password)

            const newUser = userFactory.createUser({
                username,
                nickname,
                password: hashedPassword,
            })

            await set(userRef, newUser)

            return {
                status: 200,
                data: newUser,
            }
        } catch (e) {
            console.error(e)
            return { status: 500, reason: 'Failed to request API - createUser' }
        }
    },

    remove: async (username: string): Promise<ClientResponse> => {
        const userRef = ref(db, `/users/${username}`)
        try {
            await remove(userRef)

            return {
                status: 200,
            }
        } catch (e) {
            console.error(e)
            return {
                status: 500,
                reason: 'Failed to request API - removeUser',
            }
        }
    },

    updateProfile: async (
        username: string,
        profile: UserProfile,
    ): Promise<ClientResponse<UserProfile>> => {
        const userProfileRef = ref(db, `users/${username}/profile`)

        try {
            await set(userProfileRef, profile)
            return {
                status: 200,
                data: profile,
            }
        } catch (e) {
            console.error(e)
            return {
                status: 500,
                reason: 'Failed to request API - updateUserProfile',
            }
        }
    },

    updateProfileStyle: async (
        username: string,
        style: UserProfileStyle,
    ): Promise<ClientResponse<UserProfileStyle>> => {
        const userProfileStyleRef = ref(db, `users/${username}/profile/style`)
        try {
            await set(userProfileStyleRef, style)
            return {
                status: 200,
                data: style,
            }
        } catch (e) {
            console.error(e)
            return {
                status: 500,
                reason: 'failed to request API - updateUserProfileStyle',
            }
        }
    },

    updateNickname: async (
        username: string,
        nickname: string,
    ): Promise<ClientResponse<string>> => {
        const userNicknameRef = ref(db, `users/${username}/nickname`)
        try {
            await set(userNicknameRef, nickname)
            return {
                status: 200,
                data: nickname,
            }
        } catch (e) {
            console.error(e)
            return {
                status: 500,
                reason: 'Failed to request API - updateUserNickname',
            }
        }
    },
}
