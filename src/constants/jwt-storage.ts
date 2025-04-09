export const LOCALSTORAGE_JWT_ACCESS_TOKEN_NAME = 'JWT_ACCESS'
export const LOCALSTORAGE_JWT_REFRESH_TOKEN_NAME = 'JWT_REFRESH'
export const JWT_ACCESS_TOKEN_EXP = Math.floor(Date.now() / 1000) + 60 * 60 // 1 hour
export const JWT_REFRESH_TOKEN_EXP =
    Math.floor(Date.now() / 1000) + 60 * 60 * 24 * 7 // 1 week
export const JWT_SECRET = new TextEncoder().encode(
    import.meta.env.VITE_JWT_SECRET,
)
