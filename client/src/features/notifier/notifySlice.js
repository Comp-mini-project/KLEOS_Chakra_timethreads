import { createSlice } from '@reduxjs/toolkit';

const notifySlice = createSlice({
    name: 'notify',
    initialState: {
        open: false,
        message: '',
        severity: '',
    },
    reducers: {
        notifyAction: (state, action) => {
            state.open = action.payload.open;
            state.message = action.payload.message;
            state.severity = action.payload.severity;
        }
    },
});

export default notifySlice.reducer;
export const { notifyAction } = notifySlice.actions;