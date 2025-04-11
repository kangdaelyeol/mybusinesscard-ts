import { cardClient } from '@/client'
import { Card, CardProfile, CardStyle, CardTheme } from '@/models'
import {
    UpdateProfileStyleResponse,
    UpdateProfileResponse,
    UpdateNameResponse,
    UpdateDescriptionResponse,
    UpdateThemeResponse,
    DeleteResponse,
    CreateCardResponse,
    GetCardListResponse,
} from '@/services/types'
import { jwtUtil } from '@/utils'

export const cardService = {
    create: async (
        card: Card,
        username: string,
    ): Promise<CreateCardResponse> => {
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

        const res = await cardClient.create(card)
        if (res.status === 200) {
            return {
                ok: true,
                data: card,
            }
        } else if (res.status === 400 && 'reason' in res) {
            console.error(`Failed to update profile - ${res.reason}`)
            return {
                ok: false,
                reason: res.reason,
            }
        } else {
            throw new Error('Unexpected error - update profile in card service')
        }
    },

    getList: async (username: string): Promise<GetCardListResponse> => {
        const res = await cardClient.getList(username)
        if (res.status === 200 && 'data' in res) {
            return {
                ok: true,
                data: res.data,
            }
        } else if (res.status === 400 && 'reason' in res) {
            console.error(`Failed to update profile - ${res.reason}`)
            return {
                ok: false,
                reason: res.reason,
            }
        } else {
            throw new Error('Unexpected error - update profile in card service')
        }
    },

    updateProfile: async (
        cardId: string,
        profile: CardProfile,
        username: string,
    ): Promise<UpdateProfileResponse> => {
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
        const res = await cardClient.updateProfile(cardId, profile)
        if (res.status === 200) {
            return {
                ok: true,
                data: profile,
            }
        } else if (res.status === 400 && 'reason' in res) {
            console.error(`Failed to update profile - ${res.reason}`)
            return {
                ok: false,
                reason: res.reason,
            }
        } else {
            throw new Error('Unexpected error - update profile in card service')
        }
    },

    updateProfileStyle: async (
        cardId: string,
        style: CardStyle,
        username: string,
    ): Promise<UpdateProfileStyleResponse> => {
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
        const res = await cardClient.updateProfileStyle(cardId, style)
        if (res.status === 200) {
            return {
                ok: true,
                data: style,
            }
        } else if (res.status === 400 && 'reason' in res) {
            console.error(`Failed to update profile style - ${res.reason}`)
            return {
                ok: false,
                reason: res.reason,
            }
        } else {
            throw new Error(
                'Unexpected error - update profile style in card service',
            )
        }
    },

    updateName: async (
        cardId: string,
        name: string,
    ): Promise<UpdateNameResponse> => {
        const res = await cardClient.updateName(cardId, name)
        if (res.status === 200) {
            return {
                ok: true,
                data: name,
            }
        } else if (res.status === 400 && 'reason' in res) {
            console.error(`Failed to update card name - ${res.reason}`)
            return {
                ok: false,
                reason: res.reason,
            }
        } else {
            throw new Error(
                'Unexpected error - update profile style in card service',
            )
        }
    },

    updateDescription: async (
        cardId: string,
        description: string,
    ): Promise<UpdateDescriptionResponse> => {
        const res = await cardClient.updateName(cardId, description)
        if (res.status === 200) {
            return {
                ok: true,
                data: description,
            }
        } else if (res.status === 400 && 'reason' in res) {
            console.error(`Failed to update card name - ${res.reason}`)
            return {
                ok: false,
                reason: res.reason,
            }
        } else {
            throw new Error(
                'Unexpected error - update description in card service',
            )
        }
    },

    updateTheme: async (
        cardId: string,
        theme: CardTheme,
    ): Promise<UpdateThemeResponse> => {
        const res = await cardClient.updateName(cardId, theme)
        if (res.status === 200) {
            return {
                ok: true,
                data: theme,
            }
        } else if (res.status === 400 && 'reason' in res) {
            console.error(`Failed to update card name - ${res.reason}`)
            return {
                ok: false,
                reason: res.reason,
            }
        } else {
            throw new Error('Unexpected error - update theme in card service')
        }
    },

    delete: async (
        cardId: string,
        username: string,
    ): Promise<DeleteResponse> => {
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
        const res = await cardClient.remove(cardId)
        if (res.status === 200) {
            return {
                ok: true,
            }
        } else if (res.status === 400 && 'reason' in res) {
            console.error(`Failed to update card name - ${res.reason}`)
            return {
                ok: false,
                reason: res.reason,
            }
        } else {
            throw new Error('Unexpected error - update theme in card service')
        }
    },
}
