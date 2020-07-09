import {configureStore} from '@reduxjs/toolkit';
import directoryReducer from '../directory-input/reducer'
import directoryControlReducer from '../directory-control/reducer'
import {createLogger} from "redux-logger";
import thunkMiddleware from 'redux-thunk'
let middleware = [thunkMiddleware]
if (process.env.NODE_ENV !== 'production') {
    const loggerMiddleware = createLogger()
    middleware.push(loggerMiddleware)
}


export default configureStore({
    reducer: {
        directory: directoryReducer,
        directoryControl: directoryControlReducer,
    },
    middleware: middleware
});
