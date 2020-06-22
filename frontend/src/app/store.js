import { configureStore } from '@reduxjs/toolkit';
import directoryReducer from '../directory-input/reducer'
import websiteReducer from '../directory-display/reducer'
import {createLogger} from "redux-logger";
import thunkMiddleware from 'redux-thunk'
const loggerMiddleware = createLogger()



export default configureStore({
  reducer: {
    directory: directoryReducer,
    website: websiteReducer
  },
    middleware: [loggerMiddleware, thunkMiddleware]
});
