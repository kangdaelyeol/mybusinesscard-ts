import { Card, cardFactory } from '@/models'
import { CARD_ACTIONS, CardAction } from '@/reducer'

export const cardReducer = (state: Card, action: CardAction): Card => {
    switch (action.type) {
        case CARD_ACTIONS.UPDATE_NAME:
            return {
                ...state,
                name: action.payload.name,
            }
        case CARD_ACTIONS.UPDATE_DESCRIPTION:
            return {
                ...state,
                description: action.payload.description,
            }
        case CARD_ACTIONS.UPDATE_PROFILE:
            return {
                ...state,
                profile: action.payload.profile,
            }
        case CARD_ACTIONS.UPDATE_THEME:
            return {
                ...state,
                theme: action.payload.theme,
            }
        case CARD_ACTIONS.CLEAR_CARD:
            return cardFactory.createCard()
        case CARD_ACTIONS.UPDATE_PROFILE_STYLE:
            return {
                ...state,
                profile: {
                    ...state.profile,
                    style: action.payload.style,
                },
            }
        default:
            throw new Error(`Unexpected action: ${action}`)
    }
}
