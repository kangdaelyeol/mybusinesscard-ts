export interface CardStyle {
    scale: number
    transX: number
    transY: number
    rounded: number
    width: number
    height: number
}

export interface CardProfile {
    url: string
    assetId: string
    publicId: string
    style: CardStyle
}

export interface Card {
    id: string
    name: string
    description: string
    theme: CardTheme
    createdBy: string
    createdAt: string
    profile: CardProfile
}

export type CardTheme = 'black' | 'pink'
