import { DEFAULT_CARD_PROFILE_URL } from '@/constants'
import { Card, CardProfile, CardStyle } from '@/models'

export const DEFAULT_CARD_PROFILE_STYLE: CardStyle = {
    scale: 1,
    transX: 0,
    transY: 0,
    rounded: 50,
    width: 120,
    height: 120,
}

export const DEFAULT_CARD_PROFILE: CardProfile = {
    url: DEFAULT_CARD_PROFILE_URL,
    style: DEFAULT_CARD_PROFILE_STYLE,
    assetId: '',
    publicId: '',
}

export const DEFAULT_CARD: Card = {
    id: '',
    name: '',
    description: '',
    theme: 'black',
    createdBy: '',
    createdAt: '',
    profile: DEFAULT_CARD_PROFILE,
}
