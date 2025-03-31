import { Card, CardProfile, CardStyle } from '@/models'
import { db } from '@/service/firebase'
import {
    ref,
    set,
    remove,
    query,
    orderByChild,
    equalTo,
    get,
} from 'firebase/database'
import { CardListResponse, CardClientResponse } from '@/client/types'

export const cardClient = {
    getList: async (username: string): Promise<CardListResponse> => {
        const cardRef = ref(db, 'cards')

        const dbQuery = query(
            cardRef,
            orderByChild('createdBy'),
            equalTo(username),
        )

        try {
            const snapshot = await get(dbQuery)

            if (!snapshot.exists()) return { status: 200, data: [] }
            else {
                const cards = snapshot.val()

                return { status: 200, data: Object.values(cards) }
            }
        } catch (e) {
            console.error(e)
            return {
                status: 400,
                reason: 'Failed to request API - getCardList',
            }
        }
    },

    create: async (card: Card): Promise<CardClientResponse> => {
        try {
            const cardRef = ref(db, `cards/${card.id}`)
            await set(cardRef, card)
            return {
                status: 200,
            }
        } catch (e) {
            console.error(e)
            return {
                status: 400,
                reason: 'Failed to request API - createCard',
            }
        }
    },

    updateName: async (
        cardId: string,
        value: string,
    ): Promise<CardClientResponse> => {
        try {
            const cardRef = ref(db, `cards/${cardId}/name`)
            await set(cardRef, value)
            return {
                status: 200,
            }
        } catch (e) {
            console.error(e)
            return {
                status: 400,
                reason: 'Failed to request API - updateCardName',
            }
        }
    },

    updateDescription: async (
        cardId: string,
        value: string,
    ): Promise<CardClientResponse> => {
        try {
            const cardRef = ref(db, `cards/${cardId}/description`)
            await set(cardRef, value)
            return {
                status: 200,
            }
        } catch (e) {
            console.error(e)
            return {
                status: 400,
                reason: 'Failed to request API - updateCardDescription',
            }
        }
    },

    updateTheme: async (
        cardId: string,
        value: string,
    ): Promise<CardClientResponse> => {
        try {
            const cardRef = ref(db, `cards/${cardId}/theme`)
            await set(cardRef, value)
            return {
                status: 200,
            }
        } catch (e) {
            console.error(e)
            return {
                status: 400,
                reason: 'Failed to request API - updateCardTheme',
            }
        }
    },

    updateProfile: async (
        cardId: string,
        value: CardProfile,
    ): Promise<CardClientResponse> => {
        try {
            const cardRef = ref(db, `cards/${cardId}/profile`)
            await set(cardRef, value)
            return {
                status: 200,
            }
        } catch (e) {
            return {
                status: 400,
                reason: 'Failed to request API - updateCardProfile',
            }
        }
    },

    updateProfileStyle: async (
        cardId: string,
        value: CardStyle,
    ): Promise<CardClientResponse> => {
        try {
            const cardRef = ref(db, `cards/${cardId}/profile/style`)
            await set(cardRef, value)
            return {
                status: 200,
            }
        } catch (e) {
            console.error(e)
            return {
                status: 400,
                reason: 'Failed to request API - updateCardProfileStyle',
            }
        }
    },

    remove: async (cardId: string): Promise<CardClientResponse> => {
        try {
            const cardRef = ref(db, `cards/${cardId}`)
            await remove(cardRef)

            return {
                status: 200,
            }
        } catch (e) {
            console.error(e)
            return {
                status: 400,
                reason: 'Failed to request API - removeCard',
            }
        }
    },
}
