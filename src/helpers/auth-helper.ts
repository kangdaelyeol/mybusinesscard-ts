import { LOCALSTORAGE_TOKEN_NAME } from '@/constants'

export const authHelper = {
    getLocalStorageUsername: (): string | null => {
        const storageUsername = localStorage.getItem(LOCALSTORAGE_TOKEN_NAME)
        return storageUsername
    },

    removeLocalStorageUsername: (): void => {
        localStorage.removeItem(LOCALSTORAGE_TOKEN_NAME)
    },
}
