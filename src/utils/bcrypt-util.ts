import bcrypt from 'bcryptjs'

export const bcryptUtil = {
    hash: async (content: string): Promise<string> => {
        const salt = await bcrypt.genSalt(
            import.meta.env.VITE_BCRYPT_SALT_ROUND,
        )
        const hash = await bcrypt.hash(content, salt)

        return hash
    },

    compare: async (content: string, hash: string): Promise<boolean> => {
        const res = await bcrypt.compare(content, hash)

        return res
    },
}
