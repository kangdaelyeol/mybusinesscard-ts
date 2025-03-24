import { DEFAULT_PROFILE_URL } from '@/constants'
import { User, UserProfile, UserProfileStyle } from '@/models'

export const DEFAULT_USER_PROFILE_STYLE: UserProfileStyle = {
    scale: 1,
    transX: 0,
    transY: 0,
    rounded: 50,
    width: 120,
    height: 120,
}

export const DEFAULT_USER_PROFILE: UserProfile = {
    url: DEFAULT_PROFILE_URL,
    assetId: '',
    publicId: '',
    style: DEFAULT_USER_PROFILE_STYLE,
}

export const DEFAULT_USER: User = {
    username: '',
    nickname: '',
    profile: DEFAULT_USER_PROFILE,
}
