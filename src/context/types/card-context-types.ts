import { Card } from '@/models'
import { CardAction } from '@/reducer'
import { Dispatch } from 'react'

export interface CardContextType {
    cardState: Card
    cardDispatch: Dispatch<CardAction>
}
