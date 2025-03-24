import {
    DeepPartial,
    DEFAULT_USER,
    DEFAULT_USER_PROFILE,
    DEFAULT_USER_PROFILE_STYLE,
    User,
    UserProfile,
    UserProfileStyle,
} from '@/models'

export const userFactory = {
    createUserProfileStyle(
        style: Partial<UserProfileStyle> = {},
    ): UserProfileStyle {
        return {
            scale: style.scale ?? DEFAULT_USER_PROFILE_STYLE.scale,
            transX: style.transX ?? DEFAULT_USER_PROFILE_STYLE.transX,
            transY: style.transY ?? DEFAULT_USER_PROFILE_STYLE.transY,
            rounded: style.rounded ?? DEFAULT_USER_PROFILE_STYLE.rounded,
            width: style.width ?? DEFAULT_USER_PROFILE_STYLE.width,
            height: style.height ?? DEFAULT_USER_PROFILE_STYLE.height,
        }
    },

    createUserProfile(profile: DeepPartial<UserProfile> = {}): UserProfile {
        return {
            url: profile.url ?? DEFAULT_USER_PROFILE.url,
            assetId: profile.assetId ?? DEFAULT_USER_PROFILE.assetId,
            publicId: profile.publicId ?? DEFAULT_USER_PROFILE.publicId,
            style: profile.style
                ? this.createUserProfileStyle(profile.style)
                : DEFAULT_USER_PROFILE_STYLE,
        }
    },

    createUser(user: DeepPartial<User> = {}): User {
        return {
            username: user.username ?? DEFAULT_USER.username,
            nickname: user.nickname ?? DEFAULT_USER.nickname,
            profile: user.profile
                ? this.createUserProfile(user.profile)
                : DEFAULT_USER_PROFILE,
        }
    },
}
