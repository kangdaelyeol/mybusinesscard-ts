import { cardService, userService } from '@/services'
import { Card, User } from '@/models'
import { SERVICE_ERROR_TYPE, ServiceResponse } from '@/services/types'

export const userFacade = {
    getUserWithCardList: async (
        username: string,
    ): Promise<ServiceResponse<{ user: User; cardList: Card[] }>> => {
        const resList = await Promise.all([
            userService.get(username),
            cardService.getList(username),
        ])

        if (!resList[0].ok || !resList[1].ok) {
            console.error('Failed to get User with Card List - user facade')
            return {
                ok: false,
                errorType: SERVICE_ERROR_TYPE.API_ERROR,
                reason: 'Failed to get User with Card List',
            }
        }

        return {
            ok: true,
            data: {
                user: resList[0].data as User,
                cardList: resList[1].data as Card[],
            },
        }
    },
}
