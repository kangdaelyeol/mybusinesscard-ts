export interface UserProfileStyle {
    scale: number
    transX: number
    transY: number
    rounded: number
    width: number
    height: number
}

export interface UserProfile {
    url: string
    assetId: string
    publicId: string
    style: UserProfileStyle
}

export interface User {
    username: string
    nickname: string
    profile: UserProfile
}
