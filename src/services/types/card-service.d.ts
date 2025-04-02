import { Card, CardProfile, CardStyle, CardTheme } from '@/models'

export type CreateCardResponse =
    | {
          ok: true
          data: Card
      }
    | {
          ok: false
          reason: string
      }
export type GetCardListResponse =
    | {
          ok: true
          data: Card[]
      }
    | {
          ok: false
          reason: string
      }

export type UpdateProfileStyleResponse =
    | {
          ok: true
          data: CardStyle
      }
    | {
          ok: false
          reason: string
      }

export type UpdateProfileResponse =
    | {
          ok: true
          data: CardProfile
      }
    | {
          ok: false
          reason: string
      }

export type UpdateNameResponse =
    | {
          ok: true
          data: string
      }
    | {
          ok: false
          reason: string
      }

export type UpdateDescriptionResponse =
    | {
          ok: true
          data: string
      }
    | {
          ok: false
          reason: string
      }

export type UpdateThemeResponse =
    | {
          ok: true
          data: CardTheme
      }
    | {
          ok: false
          reason: string
      }

export type DeleteResponse =
    | {
          ok: true
      }
    | {
          ok: false
          reason: string
      }
