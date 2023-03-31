import { configureStore } from '@reduxjs/toolkit';
import userReducer from '../features/user/userSlice';
import loadingReducer from '../features/loading/loadingSlice';

const store = configureStore({
    reducer: {
        user: userReducer,
        loading: loadingReducer,
    },
    middleware: (getDefaultMiddleware) => getDefaultMiddleware(),

    devTools: import.meta.env.NODE_ENV !== 'production',
});

export default store;
