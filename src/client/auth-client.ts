import { db } from '@/config/firebase'
import { ref, get, child, set } from 'firebase/database'
import { bcryptUtil, jwtUtil } from '@/auth'
import { ClientResponse } from '@/client/types'
import {
    LOCALSTORAGE_JWT_ACCESS_TOKEN_NAME,
    LOCALSTORAGE_JWT_REFRESH_TOKEN_NAME,
} from '@/constants'

export const authClient = {
    signIn: async (
        username: string,
        password: string,
        rememberMe: boolean,
    ): Promise<ClientResponse<string>> => {
        try {
            const snapshot = await get(child(ref(db), `/users/${username}`))

            if (!snapshot.exists()) {
                return { status: 400, reason: 'invalid username' }
            }

            const userData = snapshot.val()

            const comparePasswordRes = await bcryptUtil.compare(
                password,
                userData.password,
            )

            if (!comparePasswordRes)
                return { status: 400, reason: "password doesn't match!" }

            const jwtToken = await jwtUtil.generateToken(username, rememberMe)

            localStorage.setItem(
                LOCALSTORAGE_JWT_ACCESS_TOKEN_NAME,
                jwtToken.accessToken,
            )

            if (jwtToken.refreshToken) {
                localStorage.setItem(
                    LOCALSTORAGE_JWT_REFRESH_TOKEN_NAME,
                    jwtToken.refreshToken,
                )
            }

            return { status: 200, data: username }
        } catch (e) {
            console.log(e)
            return { status: 500, reason: 'Failed to request API - signIn' }
        }
    },

    changePassword: async (
        username: string,
        password: string,
        newPassword: string,
    ): Promise<ClientResponse> => {
        try {
            const userPasswordRef = ref(db, `users/${username}/password`)
            const pw = await get(userPasswordRef)

            const comparePasswordRes = await bcryptUtil.compare(
                password,
                pw.val(),
            )

            if (!comparePasswordRes) {
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

            const hashedPassword = await bcryptUtil.hash(newPassword)

            await set(userPasswordRef, hashedPassword)
            return { status: 200 }
        } catch (e) {
            return {
                status: 500,
                reason: 'Failed to request API - changePassword',
            }
        }
    },
}
