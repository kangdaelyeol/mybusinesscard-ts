import { CardProfile, CardStyle, CardTheme } from '@/models'

export const CARD_ACTIONS = {
    UPDATE_NAME: 'UPDATE_NAME',
    UPDATE_DESCRIPTION: 'UPDATE_DESCRIPTION',
    UPDATE_THEME: 'UPDATE_THEME',
    UPDATE_PROFILE: 'UPDATE_PROFILE',
    UPDATE_PROFILE_STYLE: 'UPDATE_PROFILE_STYLE',
    CLEAR_CARD: 'CLEAR_CARD',
} as const

export type CardAction =
    | {
          type: typeof CARD_ACTIONS.UPDATE_NAME
          payload: { name: string }
      }
    | {
          type: typeof CARD_ACTIONS.UPDATE_DESCRIPTION
          payload: { description: string }
      }
    | {
          type: typeof CARD_ACTIONS.UPDATE_THEME
          payload: { theme: CardTheme }
      }
    | {
          type: typeof CARD_ACTIONS.UPDATE_PROFILE
          payload: { profile: CardProfile }
      }
    | {
          type: typeof CARD_ACTIONS.UPDATE_PROFILE_STYLE
          payload: { style: CardStyle }
      }
    | {
          type: typeof CARD_ACTIONS.CLEAR_CARD
      }
