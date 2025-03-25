import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { User, userFactory, UserProfile, UserProfileStyle } from '@/models'

const userSlice = createSlice({
    name: 'user',
    initialState: userFactory.createUser(),
    reducers: {
        setUser: (
            state: User,
            action: PayloadAction<{
                username: string
                profile: UserProfile
                nickname: string
            }>,
        ) => {
            const { username, profile, nickname } = action.payload

            state.username = username
            state.profile = profile
            state.nickname = nickname
        },

        clearUser: (state: User) => {
            const { username, profile, nickname } = userFactory.createUser()

            state.username = username
            state.profile = profile
            state.nickname = nickname
        },

        updateUserProfile: (
            state: User,
            action: PayloadAction<{ profile: UserProfile }>,
        ) => {
            const { profile } = action.payload

            state.profile = profile
        },

        updateUserProfileStyle: (
            state: User,
            action: PayloadAction<{ style: UserProfileStyle }>,
        ) => {
            const { style } = action.payload

            state.profile.style = style
        },

        updateUserNickname: (
            state: User,
            action: PayloadAction<{ nickname: string }>,
        ) => {
            const { nickname } = action.payload

            state.nickname = nickname
        },
    },
})

export const {
    setUser,
    clearUser,
    updateUserProfile,
    updateUserProfileStyle,
    updateUserNickname,
} = userSlice.actions

export default userSlice.reducer
