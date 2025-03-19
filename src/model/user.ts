import { DEFAULT_PROFILE_URL } from '@/constants'

export const DEFAULT_USER_PROFILE_STYLE = {
    scale: 1,
    transX: 0,
    transY: 0,
    rounded: 50,
    width: 120,
    height: 120,
}

export const DEFAULT_USER_PROFILE = {
    url: DEFAULT_PROFILE_URL,
    assetId: '',
    publicId: '',
    style: DEFAULT_USER_PROFILE_STYLE,
}

export const DEFAULT_USER = {
    username: '',
    nickname: '',
    profile: DEFAULT_USER_PROFILE,
    cards: {},
}
