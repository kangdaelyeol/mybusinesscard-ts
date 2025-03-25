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
            action: PayloadAction<UserProfile>,
        ) => {
            state.profile = action.payload
        },

        updateUserProfileStyle: (
            state: User,
            action: PayloadAction<UserProfileStyle>,
        ) => {
            state.profile.style = action.payload
        },

        updateUserNickname: (state: User, action: PayloadAction<string>) => {
            state.nickname = action.payload
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
