import { Card, User } from '@/models'

export type GetUserWithCardListResponse =
    | {
          ok: true
          cardList: Card[]
          user: User
      }
    | { ok: false; reason: string }
