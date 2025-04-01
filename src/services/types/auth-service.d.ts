export type SignInResponse =
    | {
          ok: false
          reason: string
      }
    | {
          ok: true
          data: string
      }

export type ChangePasswordResponse =
    | {
          ok: false
          reason: string
      }
    | {
          ok: true
      }
