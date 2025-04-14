export type ClientResponse<R = undefined> =
    | {
          status: number
          data?: R
      }
    | {
          status: number
          reason: string
      }
