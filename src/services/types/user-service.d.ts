import { User } from '@/models'

export type CreateUserResponse =
    | {
          ok: false
          reason: string
      }
    | {
          ok: true
          data: User
      }

export type UpdateUserNicknameResponse =
    | {
          ok: false
          reason: string
      }
    | {
          ok: true
          data: string
      }
export type GetUserResponse =
    | {
          ok: false
          reason: string
      }
    | {
          ok: true
          data: User
      }
