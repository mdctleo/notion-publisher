import { configureStore } from '@reduxjs/toolkit';
import directoryReducer from '../directory-input/reducer'

export default configureStore({
  reducer: {
    directory: directoryReducer
  },
});
