import {
    DEFAULT_USER,
    DEFAULT_USER_PROFILE,
    DEFAULT_USER_PROFILE_STYLE,
} from '@/model/user'

export const userFactory = {
    createUserProfileStyle(overrides = {}) {
        return {
            ...DEFAULT_USER_PROFILE_STYLE,
            ...overrides,
        }
    },

    createUserProfile(overrides = {}) {
        return {
            ...DEFAULT_USER_PROFILE,
            ...overrides,
            style: this.createUserProfileStyle(overrides.style),
        }
    },

    createUser(overrides = {}) {
        return {
            ...DEFAULT_USER,
            ...overrides,
            profile: this.createUserProfile(overrides.profile),
        }
    },
}
