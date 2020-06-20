import {GET_DIRECTORY, RECEIVE_DIRECTORY} from "./action";

export const initialState = {
    tokenV2: "",
    directory: {},
    directoryLoading: false,
    directoryError: false
}



const directory = (state = initialState, action) => {
    switch (action.type) {
        case GET_DIRECTORY:
            return {
                ...state,
                tokenV2: action.tokenV2
            }
        case RECEIVE_DIRECTORY:
            return {
                ...state,
                directory: action.directory
            }
        default:
            return state
    }
}

export default directory