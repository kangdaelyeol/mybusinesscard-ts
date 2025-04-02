import { cardService, userService } from '@/services'
import { GetUserWithCardListResponse } from '@/facade/types'

export const userFacade = {
    getUserWithCardList: async (
        username: string,
    ): Promise<GetUserWithCardListResponse> => {
        const resList = await Promise.all([
            userService.get(username),
            cardService.getList(username),
        ])

        if (!resList[0].ok || !resList[1].ok) {
            console.error('Failed to get User with Card List - user facade')
            return {
                ok: false,
                reason: 'Failed to get User with Card List',
            }
        }

        return {
            ok: true,
            user: resList[0].data,
            cardList: resList[1].data,
        }
    },
}
