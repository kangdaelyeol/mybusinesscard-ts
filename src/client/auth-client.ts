import { db } from '@/config/firebase'
import { ref, get, child, set } from 'firebase/database'
import { AuthClientResponse, AuthGetResponse } from '@/client/types'

export const authClient = {
    signIn: async (
        username: string,
        password: string,
    ): Promise<AuthGetResponse> => {        
        try {
            const snapshot = await get(child(ref(db), `/users/${username}`))

            if (!snapshot.exists()) {
                return { status: 400, reason: 'invalid username' }
            }

            const userData = snapshot.val()
            if (userData.password !== password)
                return { status: 400, reason: "password doesn't match!" }

            return { status: 200, token: username }
        } catch (e) {
            console.log(e)
            return { status: 400, reason: 'Failed to request API - signIn' }
        }
    },

    changePassword: async (
        username: string,
        password: string,
        newPassword: string,
    ): Promise<AuthClientResponse> => {

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
