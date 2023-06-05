import { configureStore, combineReducers } from "@reduxjs/toolkit";
import projectSliderReducer from "./ProjectSlider";
import userSliderReducer from "./UserSlider";
import staffSliderReducer from "./StaffSlider";
import authReducer from "./Auth";

import {
  persistStore,
  persistReducer,
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
} from "redux-persist";
import storage from "redux-persist/lib/storage";
import { PersistGate } from "redux-persist/integration/react";

const rootReducer = combineReducers({
  authReducer: authReducer,
});

const persistConfig = {
  key: "root",
  version: 1,
  storage,
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: {
    projectSlider: projectSliderReducer,
    userSlider: userSliderReducer,
    staffSlider: staffSliderReducer,
    auth: persistedReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }),
});

export let persistor = persistStore(store);

// const store = configureStore({
//   reducer: {
//     projectSlider: projectSliderReducer,
//     userSlider: userSliderReducer,
//     staffSlider: staffSliderReducer,
//     authReducer: authReducer,
//   },
// });
