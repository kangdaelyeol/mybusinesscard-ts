import { jwtUtil } from '@/auth/jwt-util'

export const authGuard = {
    verifyTokenAndUsername: async (username: string): Promise<boolean> => {
        const accessToken = jwtUtil.getAccessToken()

        if (!accessToken) {
            console.error('Failed to verify access token')
            return false
        }

        const usernameFromAccessToken = await jwtUtil.getUsernameByAccessToken(
            accessToken,
        )

        if (!usernameFromAccessToken) {
            console.error('Failed to verify access token')
            return false
        }

        if (username !== usernameFromAccessToken) {
            console.error('Failed to authorize user')
            return false
        }

        return true
    },
}
