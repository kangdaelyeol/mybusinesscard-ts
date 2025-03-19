import { db } from '@/service/firebase'
import { ref, set, remove } from 'firebase/database'

export const cardClient = {
    create: async (username, card) => {
        try {
            const cardRef = ref(db, `users/${username}/cards/${card.id}`)
            await set(cardRef, card)
            return {
                status: 200,
            }
        } catch (e) {
            return {
                status: 400,
                reason: e,
            }
        }
    },

    updateName: async (username, cardId, value) => {
        try {
            const cardRef = ref(db, `users/${username}/cards/${cardId}/name`)
            await set(cardRef, value)
            return {
                status: 200,
            }
        } catch (e) {
            return {
                status: 400,
                reason: e,
            }
        }
    },

    updateDescription: async (username, cardId, value) => {
        try {
            const cardRef = ref(
                db,
                `users/${username}/cards/${cardId}/description`,
            )
            await set(cardRef, value)
            return {
                status: 200,
            }
        } catch (e) {
            return {
                status: 400,
                reason: e,
            }
        }
    },

    updateTheme: async (username, cardId, value) => {
        try {
            const cardRef = ref(db, `users/${username}/cards/${cardId}/theme`)
            await set(cardRef, value)
            return {
                status: 200,
            }
        } catch (e) {
            return {
                status: 400,
                reason: e,
            }
        }
    },

    updateProfile: async (username, cardId, value) => {
        try {
            const cardRef = ref(db, `users/${username}/cards/${cardId}/profile`)
            await set(cardRef, value)
            return {
                status: 200,
            }
        } catch (e) {
            return {
                status: 400,
                reason: e,
            }
        }
    },

    updateProfileStyle: async (username, cardId, value) => {
        try {
            const cardRef = ref(
                db,
                `users/${username}/cards/${cardId}/profile/style`,
            )
            await set(cardRef, value)
            return {
                status: 200,
            }
        } catch (e) {
            return {
                status: 400,
                reason: e,
            }
        }
    },

    remove: async (username, cardId) => {
        try {
            const cardRef = ref(db, `users/${username}/cards/${cardId}`)
            remove(cardRef)

            return {
                status: 200,
            }
        } catch (e) {
            return {
                status: 400,
                reason: e,
            }
        }
    },
}
