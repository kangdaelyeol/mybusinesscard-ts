export const SERVICE_ERROR_TYPE = {
    CLIENT_ERROR: 'CLIENT',
    API_ERROR: 'API',
    AUTH_ERROR: 'AUTH',
} as const

type ErrorType = (typeof SERVICE_ERROR_TYPE)[keyof typeof SERVICE_ERROR_TYPE]

export type ServiceResponse<R = undefined> =
    | {
          ok: true
          data?: R
      }
    | {
          ok: false
          errorType: ErrorType
          reason?: string
      }
