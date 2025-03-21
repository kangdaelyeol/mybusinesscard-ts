import { User } from '@/models'

interface ErrorResponse {
    status: number
    reason: string
}

export type AuthClientResponse =
    | {
          status: number
      }
    | ErrorResponse

export type AuthGetResponse =
    | {
          status: number
          data: User
      }
    | ErrorResponse
