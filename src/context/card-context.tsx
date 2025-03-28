import { createContext, useReducer } from 'react'
import { CardContextType, ContextProps } from '@/context/types'
import { cardReducer } from '@/reducer'
import { cardFactory } from '@/models'

export const CardContext = createContext<CardContextType>({
    cardState: cardFactory.createCard(),
    cardDispatch: () => {},
})

export const CardProvider = ({ children }: ContextProps) => {
    const [cardState, cardDispatch] = useReducer(
        cardReducer,
        cardFactory.createCard(),
    )
    return (
        <CardContext.Provider value={{ cardState, cardDispatch }}>
            {children}
        </CardContext.Provider>
    )
}
