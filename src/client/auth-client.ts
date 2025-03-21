import { db } from '@/service/firebase'
import { ref, get, child, set } from 'firebase/database'
import { validation } from './validate'
import { AuthClientResponse, AuthGetResponse } from './types/auth-client'

export const authClient = {
    signIn: async (
        username: string,
        password: string,
    ): Promise<AuthGetResponse> => {
        const validateUsernameRes = validation.username(username)
        if (validateUsernameRes.isValid === false) {
            return {
                status: 400,
                reason: "username has 4 to 20 length of characters and doesn't contain special symbol.",
            }
        }

        const validatePasswordRes = validation.password(password)
        if (validatePasswordRes.isValid === false) {
            return {
                status: 400,
                reason: "password has 4 to 20 length of characters and doesn't contain blank",
            }
        }

        try {
            const snapshot = await get(child(ref(db), `/users/${username}`))

            if (!snapshot.exists()) {
                return { status: 400, reason: 'invalid username' }
            }

            const userData = snapshot.val()
            if (userData.password !== password)
                return { status: 400, reason: "password doesn't match!" }

            return { status: 200, data: userData }
        } catch (e) {
            console.log(e)
            return { status: 400, reason: 'Failed to request API - signIn' }
        }
    },

    changePassword: async (
        username: string,
        password: string,
        newPassword: string,
        confirmPassword: string,
    ): Promise<AuthClientResponse> => {
        const validatePasswordRes = validation.password(password)
        if (validatePasswordRes.isValid === false) {
            return {
                status: 400,
                reason: "password has 4 to 20 length of characters and doesn't contain blank",
            }
        }

        if (newPassword !== confirmPassword) {
            return {
                status: 400,
                reason: "new password doesn't match confirm password",
            }
        }

        try {
            const userPasswordRef = ref(db, `users/${username}/password`)
            const pw = await get(userPasswordRef)

            if (pw.val() !== password) {
                return {
                    status: 400,
                    reason: "password doesn't match current password",
                }
            }

            if (password === newPassword) {
                return {
                    status: 400,
                    reason: "you can't change password into the same password",
                }
            }

            await set(userPasswordRef, newPassword)
            return { status: 200 }
        } catch (e) {
            return {
                status: 400,
                reason: 'Failed to request API - changePassword',
            }
        }
    },
}
