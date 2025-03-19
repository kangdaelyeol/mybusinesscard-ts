import {
    DEFAULT_CARD,
    DEFAULT_CARD_PROFILE,
    DEFAULT_CARD_PROFILE_STYLE,
} from '@/model/card'

export const cardFactory = {
    createCardProfileStyle(overrides = {}) {
        return {
            ...DEFAULT_CARD_PROFILE_STYLE,
            ...overrides,
        }
    },

    createCardProfile(overrides = {}) {
        return {
            ...DEFAULT_CARD_PROFILE,
            ...overrides,
            style: this.createCardProfileStyle(overrides.style),
        }
    },

    createCard(overrides = {}) {
        return {
            ...DEFAULT_CARD,
            ...overrides,
            profile: this.createCardProfile(overrides.profile),
        }
    },
}
