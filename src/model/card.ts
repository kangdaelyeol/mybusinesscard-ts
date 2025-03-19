import { DEFAULT_CARD_PROFILE_URL } from '@/constants'

export const DEFAULT_CARD_PROFILE_STYLE = {
    scale: 1,
    transX: 0,
    transY: 0,
    rounded: 50,
    width: 120,
    height: 120,
}

export const DEFAULT_CARD_PROFILE = {
    url: DEFAULT_CARD_PROFILE_URL,
    style: DEFAULT_CARD_PROFILE_STYLE,
    assetId: '',
    publicId: '',
}

export const DEFAULT_CARD = {
    id: '',
    name: '',
    description: '',
    theme: 'black',
    profile: DEFAULT_CARD_PROFILE,
}
