import { authClient } from '@/client'
import { userValidator } from '@/services/validate'
import { SERVICE_ERROR_TYPE, ServiceResponse } from '@/services/types'

export const authService = {
    signIn: async (
        username: string,
        password: string,
        rememberMe: boolean,
    ): Promise<ServiceResponse<string>> => {
        const validateUsernameRes = userValidator.username(username)

        if (!validateUsernameRes.isValid) {
            return {
                ok: false,
                errorType: SERVICE_ERROR_TYPE.CLIENT_ERROR,
                reason: "username has 4 to 20 length of characters and doesn't contain special symbol.",
            }
        }

        const validatePasswordRes = userValidator.password(password)
        if (!validatePasswordRes.isValid) {
            return {
                ok: false,
                errorType: SERVICE_ERROR_TYPE.CLIENT_ERROR,
                reason: "password has 4 to 20 length of characters and doesn't contain blank",
            }
        }

        const authRes = await authClient.signIn(username, password, rememberMe)

        if (authRes.status !== 200 && 'reason' in authRes) {
            return {
                ok: false,
                errorType: SERVICE_ERROR_TYPE.API_ERROR,
                reason: authRes.reason,
            }
        } else if (authRes.status === 200 && 'data' in authRes) {
            return {
                ok: true,
                data: authRes.data,
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
    ): Promise<ServiceResponse> => {
        const validatePasswordRes = userValidator.password(newPassword)
        if (validatePasswordRes.isValid === false) {
            return {
                ok: false,
                errorType: SERVICE_ERROR_TYPE.CLIENT_ERROR,
                reason: validatePasswordRes.reason,
            }
        }

        if (newPassword !== confirmPassword) {
            return {
                ok: false,
                errorType: SERVICE_ERROR_TYPE.CLIENT_ERROR,
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
        } else if (res.status !== 200 && 'reason' in res) {
            return {
                ok: false,
                errorType: SERVICE_ERROR_TYPE.API_ERROR,
                reason: res.reason,
            }
        } else {
            console.trace(res)
            throw new Error('Unexpected Error - change password')
        }
    },
}
