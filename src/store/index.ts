import { configureStore } from '@reduxjs/toolkit'
import cardsReducer from '@/store/cardsSlice'
import userReducer from '@/store/userSlice'

export const store = configureStore({
    reducer: {
        cards: cardsReducer,
        user: userReducer,
    },
})

export type RootState = ReturnType<typeof store.getState>

export type AppDispatch = typeof store.dispatch
