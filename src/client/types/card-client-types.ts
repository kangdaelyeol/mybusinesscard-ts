import { Card } from '@/models'

interface ErrorResponse {
    status: number
    reason: string
}

export type CardClientResponse =
    | {
          status: number
      }
    | ErrorResponse

export type CardListResponse =
    | {
          status: number
          data: Card[]
      }
    | ErrorResponse

