import { ValidationResponse } from '@/client/validate/types'

export const validation = {
    username: (username: string): ValidationResponse => {
        if (!/^[A-Za-z0-9_-]{4,20}$/.test(username)) {
            return {
                isValid: false,
                reason: "username should have 4 to 20 characters, shouldn't contain blank(nbsp) and special symbols.",
            }
        }

        return {
            isValid: true,
        }
    },

    nickname: (nickname: string): ValidationResponse => {
        if (!/^[A-Za-z가-힣0-9]{2,20}$/.test(nickname)) {
            return {
                isValid: false,
                reason: "nickname should have 2 to 20 characters, shouldn't contain blank(nbsp) and special symbols.",
            }
        }

        return {
            isValid: true,
        }
    },

    password: (password: string): ValidationResponse => {
        if (!/^[\w.%+-]{4,20}$/.test(password)) {
            return {
                isValid: false,
                reason: "password should have 4 to 20 characters, shouldn't contain blank(nbsp)",
            }
        }

        return { isValid: true }
    },
}
