import { User } from '@/models/user-model'

export type UserClientResponse = {
    status: number
    reason?: string
    data?: User
}
