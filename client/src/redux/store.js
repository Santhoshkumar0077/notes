import { configureStore } from "@reduxjs/toolkit";
import userApi from "./api/userApi";
import userReducer from "./slices/userSlice";
import noteApi from "./api/noteApi";

const store = configureStore({
	reducer: {
		user: userReducer,
		[userApi.reducerPath]: userApi.reducer,
		[noteApi.reducerPath]: noteApi.reducer,
	},
	middleware: (getDefaultMiddleware) =>
		getDefaultMiddleware().concat(userApi.middleware, noteApi.middleware),
});

export default store;
