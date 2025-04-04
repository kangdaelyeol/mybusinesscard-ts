import { authClient } from '@/client'
import { userValidator } from '@/services/validate'
import { LOCALSTORAGE_TOKEN_NAME } from '@/constants'
import { ChangePasswordResponse, SignInResponse } from '@/services/types'

export const authService = {
    signIn: async (
        username: string,
        password: string,
        rememberme: boolean,
    ): Promise<SignInResponse> => {
        const validateUsernameRes = userValidator.username(username)

        if (validateUsernameRes.isValid === false) {
            return {
                ok: false,
                reason: "username has 4 to 20 length of characters and doesn't contain special symbol.",
            }
        }

        const validatePasswordRes = userValidator.password(password)
        if (validatePasswordRes.isValid === false) {
            return {
                ok: false,
                reason: "password has 4 to 20 length of characters and doesn't contain blank",
            }
        }

        const authRes = await authClient.signIn(username, password)

        if (authRes.status !== 200 && 'reason' in authRes) {
            return {
                ok: false,
                reason: authRes.reason,
            }
        } else if (authRes.status === 200 && 'token' in authRes) {
            if (rememberme) {
                localStorage.setItem(LOCALSTORAGE_TOKEN_NAME, authRes.token)
            }

            return {
                ok: true,
                data: authRes.token,
            }
        } else {
            throw new Error('Unexpected Error - Sign in')
        }
    },

    changePassword: async (
        username: string,
        password: string,
        newPassword: string,
        confirmPassword: string,
    ): Promise<ChangePasswordResponse> => {
        const validatePasswordRes = userValidator.password(password)
        if (validatePasswordRes.isValid === false) {
            return {
                ok: false,
                reason: "password has 4 to 20 length of characters and doesn't contain blank",
            }
        }

        if (newPassword !== confirmPassword) {
            return {
                ok: false,
                reason: "new password doesn't match confirm password",
            }
        }

        const res = await authClient.changePassword(
            username,
            password,
            newPassword,
        )

        if (res.status === 200) {
            return {
                ok: true,
            }
        } else if (res.status === 400 && 'reason' in res) {
            return {
                ok: false,
                reason: res.reason,
            }
        } else {
            console.trace(res)
            throw new Error('Unexpected Error - change password')
        }
    },
}
