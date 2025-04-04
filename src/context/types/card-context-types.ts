import { Card } from '@/models'
import { CardAction } from '@/reducer'
import { ActionDispatch, Dispatch } from 'react'

export interface CardContextType {
    cardState: Card
    cardDispatch: Dispatch<CardAction>
}
