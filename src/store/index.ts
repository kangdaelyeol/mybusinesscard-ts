import { configureStore } from '@reduxjs/toolkit'
import cardsReducer from '@/store/cards-slice'
import userReducer from '@/store/user-slice'

export const store = configureStore({
    reducer: {
        cards: cardsReducer,
        user: userReducer,
    },
})

export type RootState = ReturnType<typeof store.getState>

export type AppDispatch = typeof store.dispatch
