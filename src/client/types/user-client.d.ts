import { User } from '@/models/user-model'

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
          status: numeber
          data: User
      }
    | ErrorResponse
