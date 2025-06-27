import { configureStore } from '@reduxjs/toolkit';
import rootReducer from './reducers'; // or your slice reducers

const store = configureStore({
  reducer: rootReducer,
});

export default store;