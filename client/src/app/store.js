import { configureStore } from '@reduxjs/toolkit';
import userReducer from '../features/user/userSlice';
import loadingReducer from '../features/loading/loadingSlice';
import notifyReducer from '../features/notifier/notifySlice';
import themeReducer from '../features/theme/themeSlice';

const store = configureStore({
    reducer: {
        user: userReducer,
        loading: loadingReducer,
        notify: notifyReducer,
        theme: themeReducer,
    },
    middleware: (getDefaultMiddleware) => getDefaultMiddleware(),

    devTools: import.meta.env.NODE_ENV !== 'production',
});

export default store;
