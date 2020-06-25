import {configureStore} from '@reduxjs/toolkit';
import directoryReducer from '../directory-input/reducer'
import directoryControlReducer from '../directory-control/reducer'
import {createLogger} from "redux-logger";
import thunkMiddleware from 'redux-thunk'

const loggerMiddleware = createLogger()


export default configureStore({
    reducer: {
        directory: directoryReducer,
        directoryControl: directoryControlReducer,
    },
    middleware: [loggerMiddleware, thunkMiddleware]
});
