import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    value: 'lavender',
};

export const themeSlice = createSlice({
    name: 'theme',
    initialState,
    reducers: {
        setThemeAction: (state, action) => {
            state.value = action.payload;
            localStorage.setItem('theme', action.payload);
        }
    }
});

export const { setThemeAction } = themeSlice.actions;
export default themeSlice.reducer;


