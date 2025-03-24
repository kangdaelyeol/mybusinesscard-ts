import {
    Card,
    CardProfile,
    CardStyle,
    DeepPartial,
    DEFAULT_CARD,
    DEFAULT_CARD_PROFILE,
    DEFAULT_CARD_PROFILE_STYLE,
} from '@/models'

export const cardFactory = {
    createCardProfileStyle(style: Partial<CardStyle> = {}): CardStyle {
        return {
            scale: style.scale ?? DEFAULT_CARD_PROFILE_STYLE.scale,
            transX: style.transX ?? DEFAULT_CARD_PROFILE_STYLE.transX,
            transY: style.transY ?? DEFAULT_CARD_PROFILE_STYLE.transY,
            rounded: style.rounded ?? DEFAULT_CARD_PROFILE_STYLE.rounded,
            width: style.width ?? DEFAULT_CARD_PROFILE_STYLE.width,
            height: style.height ?? DEFAULT_CARD_PROFILE_STYLE.height,
        }
    },

    createCardProfile(profile: DeepPartial<CardProfile> = {}): CardProfile {
        return {
            url: profile.url ?? DEFAULT_CARD_PROFILE.url,
            assetId: profile.assetId ?? DEFAULT_CARD_PROFILE.assetId,
            publicId: profile.publicId ?? DEFAULT_CARD_PROFILE.publicId,
            style: profile.style
                ? this.createCardProfileStyle(profile.style)
                : DEFAULT_CARD_PROFILE.style,
        }
    },

    createCard(card: DeepPartial<Card> = {}): Card {
        return {
            id: card.id ?? DEFAULT_CARD.id,
            name: card.name ?? DEFAULT_CARD.name,
            description: card.description ?? DEFAULT_CARD.description,
            theme: card.theme ?? DEFAULT_CARD.theme,
            createdBy: card.createdBy ?? DEFAULT_CARD.createdBy,
            createdAt: card.createdAt ?? DEFAULT_CARD.createdAt,
            profile: card.profile
                ? this.createCardProfile(card.profile)
                : DEFAULT_CARD.profile,
        }
    },
}
