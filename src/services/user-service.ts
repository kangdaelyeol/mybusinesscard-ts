import { userClient } from '@/client'
import { UserProfile, UserProfileStyle } from '@/models'
import { userValidator } from '@/services/validate'
import {
    CreateUserResponse,
    GetUserResponse,
    UpdateUserNicknameResponse,
} from '@/services/types'
import { jwtUtil } from '@/utils'

export const userService = {
    get: async (username: string): Promise<GetUserResponse> => {
        const validateUsernameRes = userValidator.username(username)

        if (validateUsernameRes.isValid === false) {
            return {
                ok: false,
                reason: validateUsernameRes.reason,
            }
        }

        const res = await userClient.get(username)

        if (res.status === 200 && 'data' in res) {
            return {
                ok: true,
                data: res.data,
            }
        } else if (res.status === 400 && 'reason' in res) {
            return {
                ok: false,
                reason: res.reason,
            }
        } else {
            throw new Error('Unexpected Error - get User in userservice')
        }
    },

    create: async (
        username: string,
        password: string,
        confirmPassword: string,
        nickname: string,
    ): Promise<CreateUserResponse> => {
        const validateUsernameRes = userValidator.username(username)

        if (validateUsernameRes.isValid === false) {
            return {
                ok: false,
                reason: validateUsernameRes.reason,
            }
        }

        const validateNicknameRes = userValidator.nickname(nickname)

        if (validateNicknameRes.isValid === false) {
            return {
                ok: false,
                reason: validateNicknameRes.reason,
            }
        }

        const validatePasswordRes = userValidator.password(password)

        if (validatePasswordRes.isValid === false) {
            return {
                ok: false,
                reason: validatePasswordRes.reason,
            }
        }

        if (password !== confirmPassword) {
            return {
                ok: false,
                reason: "Password doesn't match confirm password correctly.\nPlease check your password again",
            }
        }

        const res = await userClient.create(username, nickname, password)

        if (res.status === 200 && 'data' in res) {
            return {
                ok: true,
                data: res.data,
            }
        } else if (res.status === 400 && 'reason' in res) {
            return {
                ok: false,
                reason: res.reason,
            }
        } else {
            throw new Error('Unexpected Error - creating User in userservice')
        }
    },

    updateProfileStyle: async (
        username: string,
        style: UserProfileStyle,
    ): Promise<
        { ok: false; reason: string } | { ok: true; data: UserProfileStyle }
    > => {
        const accessToken = jwtUtil.getAccessToken()

        if (!accessToken) {
            return {
                ok: false,
                reason: 'Failed to verify access token',
            }
        }

        const usernameFromAccessToken = await jwtUtil.getUsernameByAccessToken(
            accessToken,
        )

        if (!usernameFromAccessToken) {
            return {
                ok: false,
                reason: 'Failed to verify access token',
            }
        }

        if (username !== usernameFromAccessToken) {
            return {
                ok: false,
                reason: 'Failed to authorize user',
            }
        }
        const res = await userClient.updateProfileStyle(username, style)
        if (res.status === 200) {
            return { ok: true, data: style }
        } else if (res.status !== 200 && 'reason' in res) {
            console.error(`Failed to update user profile style - ${res.reason}`)
            return { ok: false, reason: res.reason }
        } else {
            throw new Error(
                'Unexpected Error - updating profile style in userservice',
            )
        }
    },

    updateProfile: async (
        username: string,
        profile: UserProfile,
    ): Promise<
        { ok: true; data: UserProfile } | { ok: false; reason: string }
    > => {
        const accessToken = jwtUtil.getAccessToken()

        if (!accessToken) {
            return {
                ok: false,
                reason: 'Failed to verify access token',
            }
        }

        const usernameFromAccessToken = await jwtUtil.getUsernameByAccessToken(
            accessToken,
        )

        if (!usernameFromAccessToken) {
            return {
                ok: false,
                reason: 'Failed to verify access token',
            }
        }

        if (username !== usernameFromAccessToken) {
            return {
                ok: false,
                reason: 'Failed to authorize user',
            }
        }
        const res = await userClient.updateProfile(username, profile)
        if (res.status === 200) {
            return { ok: true, data: profile }
        } else if (res.status !== 200 && 'reason' in res) {
            console.error(`Failed to update user profile - ${res.reason}`)
            return { ok: false, reason: res.reason }
        } else {
            throw new Error(
                'Unexpected Error - updating profile in userservice',
            )
        }
    },

    updateNickname: async (
        username: string,
        nickname: string,
    ): Promise<UpdateUserNicknameResponse> => {
        const accessToken = jwtUtil.getAccessToken()

        if (!accessToken) {
            return {
                ok: false,
                reason: 'Failed to verify access token',
            }
        }

        const usernameFromAccessToken = await jwtUtil.getUsernameByAccessToken(
            accessToken,
        )

        if (!usernameFromAccessToken) {
            return {
                ok: false,
                reason: 'Failed to verify access token',
            }
        }

        if (username !== usernameFromAccessToken) {
            return {
                ok: false,
                reason: 'Failed to authorize user',
            }
        }
        const validateNicknameRes = userValidator.nickname(nickname)

        if (validateNicknameRes.isValid === false) {
            return {
                ok: false,
                reason: validateNicknameRes.reason,
            }
        }

        const res = await userClient.updateNickname(username, nickname)
        if (res.status === 200) {
            return { ok: true, data: nickname }
        } else if (res.status !== 200 && 'reason' in res) {
            console.error(`Failed to update user nickname - ${res.reason}`)
            return { ok: false, reason: res.reason }
        } else {
            throw new Error(
                'Unexpected Error - updating nickname in userservice',
            )
        }
    },

    delete: async (
        username: string,
    ): Promise<{ ok: true } | { ok: false; reason: string }> => {
        const accessToken = jwtUtil.getAccessToken()

        if (!accessToken) {
            return {
                ok: false,
                reason: 'Failed to verify access token',
            }
        }

        const usernameFromAccessToken = await jwtUtil.getUsernameByAccessToken(
            accessToken,
        )

        if (!usernameFromAccessToken) {
            return {
                ok: false,
                reason: 'Failed to verify access token',
            }
        }

        if (username !== usernameFromAccessToken) {
            return {
                ok: false,
                reason: 'Failed to authorize user',
            }
        }
        const res = await userClient.remove(username)

        if (res.status === 200) return { ok: true }
        else if (res.status && 'reason' in res) {
            console.error(`Failed to delete user - ${res.reason}`)
            return { ok: false, reason: res.reason }
        } else {
            throw new Error('Unexpected Error - deleting user in userservice')
        }
    },
}
