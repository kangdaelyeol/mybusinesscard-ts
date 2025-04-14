export type ServiceResponse<R = undefined> =
    | {
          ok: true
          data?: R
      }
    | {
          ok: false
          reason: string
      }
