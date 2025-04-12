import { User } from '@/models'

interface ErrorResponse {
    status: number
    reason: string
}

export type UserClientResponse =
    | {
          status: number
      }
    | ErrorResponse

export type UserGetResponse =
    | {
          status: number
          data: User
      }
    | ErrorResponse
