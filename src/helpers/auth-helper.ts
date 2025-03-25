import { cardClient, userClient } from '@/client'
import { LOCALSTORAGE_TOKEN_NAME } from '@/constants'
import { Card, User } from '@/models'

export const authHelper = {
    getLocalStorageUsername: (): string | null => {
        const storageUsername = localStorage.getItem(LOCALSTORAGE_TOKEN_NAME)
        return storageUsername
    },

    removeLocalStorageUsername: (): void => {
        localStorage.removeItem(LOCALSTORAGE_TOKEN_NAME)
    },

    fetchUser: async (username: string): Promise<User | null> => {
        const getUserRes = await userClient.get(username)
        if (getUserRes.status === 200 && 'data' in getUserRes)
            return getUserRes.data
        else if (getUserRes.status === 400 && 'reason' in getUserRes) {
            console.error(
                `Unexpected Error in requesting card list - ${getUserRes.reason}`,
            )
            return null
        } else {
            console.error(`Unexpected result - ${getUserRes}`)
            return null
        }
    },

    fetchCardList: async (username: string): Promise<Card[] | null> => {
        const getCardListRes = await cardClient.getList(username)
        if (getCardListRes.status === 200 && 'data' in getCardListRes) {
            return getCardListRes.data
        } else if (
            getCardListRes.status === 400 &&
            'reason' in getCardListRes
        ) {
            console.error(
                `Unexpected Error in requesting card list - ${getCardListRes.reason}`,
            )
            return null
        } else {
            console.error(`Unexpected result - ${getCardListRes}`)
            return null
        }
    },
}
