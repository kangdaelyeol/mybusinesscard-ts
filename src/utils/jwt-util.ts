import * as jose from 'jose'
import {
    JWT_ACCESS_TOKEN_EXP,
    JWT_REFRESH_TOKEN_EXP,
    JWT_SECRET,
    LOCALSTORAGE_JWT_ACCESS_TOKEN_NAME,
    LOCALSTORAGE_JWT_REFRESH_TOKEN_NAME,
} from '@/constants'

interface GenerateTokenResponse {
    accessToken: string
    refreshToken: string | null
}

type VerityTokenResponse =
    | {
          ok: false
      }
    | {
          ok: true
          data: jose.JWTPayload
      }

export const jwtUtil = {
    generateToken: async (
        username: string,
        rememberMe: boolean,
    ): Promise<GenerateTokenResponse> => {
        const accessToken = await new jose.SignJWT({ username })
            .setProtectedHeader({ alg: import.meta.env.VITE_JWT_ALG })
            .setExpirationTime(JWT_ACCESS_TOKEN_EXP)
            .sign(JWT_SECRET)

        let refreshToken = null

        if (rememberMe) {
            refreshToken = await new jose.SignJWT({
                username,
            })
                .setProtectedHeader({ alg: import.meta.env.VITE_JWT_ALG })
                .setExpirationTime(JWT_REFRESH_TOKEN_EXP)
                .sign(JWT_SECRET)
        }

        return { accessToken, refreshToken }
    },

    generateAccessTokenByRefreshToken: async (
        refreshToken: string,
    ): Promise<string | null> => {
        try {
            const { payload } = await jose.jwtVerify(refreshToken, JWT_SECRET)

            if (!('username' in payload)) return null

            const accessToken = await new jose.SignJWT({
                username: payload.username,
            })
                .setProtectedHeader({ alg: import.meta.env.VITE_JWT_ALG })
                .setExpirationTime(JWT_ACCESS_TOKEN_EXP)
                .sign(JWT_SECRET)

            return accessToken
        } catch (e) {
            return null
        }
    },

    getRefreshToken: (): string | null => {
        return localStorage.getItem(LOCALSTORAGE_JWT_REFRESH_TOKEN_NAME)
    },

    getAccessToken: (): string | null => {
        return localStorage.getItem(LOCALSTORAGE_JWT_ACCESS_TOKEN_NAME)
    },

    getUsernameByAccessToken: async (
        accessToken: string,
    ): Promise<string | null> => {
        try {
            const { payload } = await jose.jwtVerify(accessToken, JWT_SECRET)

            if (!('username' in payload)) return null

            return payload.username as string
        } catch (e) {
            return null
        }
    },

    verifyAccessToken: async (token: string): Promise<VerityTokenResponse> => {
        try {
            const { payload } = await jose.jwtVerify(token, JWT_SECRET)

            return { ok: true, data: payload }
        } catch (e) {
            console.error(
                `Invalid(expired) token or Failed to verify JWT token - ${e}`,
            )
            return { ok: false }
        }
    },

    deleteToken: () => {
        localStorage.removeItem(LOCALSTORAGE_JWT_ACCESS_TOKEN_NAME)
        localStorage.removeItem(LOCALSTORAGE_JWT_REFRESH_TOKEN_NAME)
    },
}
