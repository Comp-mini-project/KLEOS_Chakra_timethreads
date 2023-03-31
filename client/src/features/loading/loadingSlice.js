import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    status: 'idle',
    userObj: null,
};

const userSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {
        signIn: (state, action) => {
            state.userObj = action.payload;
            state.status = 'online';
            window.localStorage.setItem(
                'timelineApp',
                state.userObj.token
            );
        },
        signOut: (state) => {
            state.userObj = initialState.userObj;
            state.status = 'offline';
            window.localStorage.removeItem('timelineApp');
        },
    },
});

export const { signIn, signOut } = userSlice.actions;
export default userSlice.reducer;
