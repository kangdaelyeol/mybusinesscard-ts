import { createSlice } from '@reduxjs/toolkit'

const cardsSlice = createSlice({
    name: 'cards',
    initialState: [],
    reducers: {
        initCards: (_, action) => {
            const { cards } = action.payload
            return [...cards]
        },

        clearCards: () => {
            return []
        },

        updateCardName: (state, action) => {
            const { id, value } = action.payload

            const idx = state.findIndex((card) => card.id === id)
            state[idx].name = value
        },

        updateCardDescription: (state, action) => {
            const { id, value } = action.payload

            const idx = state.findIndex((card) => card.id === id)
            state[idx].description = value
        },

        updateCardTheme: (state, action) => {
            const { id, value } = action.payload

            const idx = state.findIndex((card) => card.id === id)
            state[idx].theme = value
        },

        updateCardProfile: (state, action) => {
            const { id, value } = action.payload

            const idx = state.findIndex((card) => card.id === id)
            state[idx].profile = value
        },

        updateCardProfileStyle: (state, action) => {
            const { id, value } = action.payload

            const idx = state.findIndex((card) => card.id === id)
            state[idx].profile.style = { ...state[idx].profile.style, ...value }
        },

        deleteCard: (state, action) => {
            const { id } = action.payload

            const idx = state.findIndex((card) => card.id === id)

            state.splice(idx, 1)
        },

        createCard: (state, action) => {
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
