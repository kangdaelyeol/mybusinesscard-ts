export type ValidationResponse =
    | {
          isValid: true
      }
    | {
          isValid: false
          reason: string
      }
