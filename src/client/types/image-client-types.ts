interface ErrorResponse {
    status: number
    reason: string
}

export type UploadCloudinaryResponse =
    | {
          status: number
          data: any
      }
    | ErrorResponse

export type DeleteCloudinaryResponse =
    | {
          status: number
      }
    | ErrorResponse
