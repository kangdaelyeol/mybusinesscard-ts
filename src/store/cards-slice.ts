import { createSlice, PayloadAction } from '@reduxjs/toolkit'

import { Card, CardProfile, CardTheme } from '@/models'

type CardListState = Card[]

const cardsSlice = createSlice({
    name: 'cards',
    initialState: [] as CardListState,
    reducers: {
        initCards: (_, action: PayloadAction<{ cards: Card[] }>) => {
            const { cards } = action.payload
            return [...cards]
        },

        clearCards: () => {
            return []
        },

        updateCardName: (
            state,
            action: PayloadAction<{ id: string; value: string }>,
        ) => {
            const { id, value } = action.payload

            const idx = state.findIndex((card) => card.id === id)

            if (idx === -1) {
                console.error(`Can't find cards id - ${id}`)
                return
            }

            state[idx].name = value
        },

        updateCardDescription: (
            state,
            action: PayloadAction<{ id: string; value: string }>,
        ) => {
            const { id, value } = action.payload

            const idx = state.findIndex((card) => card.id === id)

            if (idx === -1) {
                console.error(`Can't find cards id - ${id}`)
                return
            }

            state[idx].description = value
        },

        updateCardTheme: (
            state,
            action: PayloadAction<{ id: string; value: CardTheme }>,
        ) => {
            const { id, value } = action.payload

            const idx = state.findIndex((card) => card.id === id)

            if (idx === -1) {
                console.error(`Can't find cards id - ${id}`)
                return
            }

            state[idx].theme = value
        },

        updateCardProfile: (
            state,
            action: PayloadAction<{ id: string; value: CardProfile }>,
        ) => {
            const { id, value } = action.payload

            const idx = state.findIndex((card) => card.id === id)

            if (idx === -1) {
                console.error(`Can't find cards id - ${id}`)
                return
            }

            state[idx].profile = value
        },

        updateCardProfileStyle: (
            state,
            action: PayloadAction<{ id: string; value: CardProfile }>,
        ) => {
            const { id, value } = action.payload

            const idx = state.findIndex((card) => card.id === id)

            if (idx === -1) {
                console.error(`Can't find cards id - ${id}`)
                return
            }

            state[idx].profile.style = { ...state[idx].profile.style, ...value }
        },

        deleteCard: (state, action: PayloadAction<{ id: string }>) => {
            const { id } = action.payload

            const idx = state.findIndex((card) => card.id === id)

            if (idx === -1) {
                console.error(`Can't find cards id - ${id}`)
                return
            }

            state.splice(idx, 1)
        },

        createCard: (state, action: PayloadAction<{ card: Card }>) => {
            const { card } = action.payload
            state.push(card)
        },
    },
})

export const {
    initCards,
    clearCards,
    createCard,
    updateCardDescription,
    updateCardName,
    updateCardTheme,
    updateCardProfile,
    updateCardProfileStyle,
    deleteCard,
} = cardsSlice.actions

export default cardsSlice.reducer
