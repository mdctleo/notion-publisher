import {
    SET_NEXT_STEP,
    SET_INDEX,
    SET_SELECTION,
    SET_WEBSITE_URL,
    SET_MAKE_WEBSITE_LOADING,
    SET_MAKE_WEBSITE_ERROR
} from "./action";

export const initialState = {
    selection: [],
    step: 0,
    index: "",
    url: "",
    makeWebsiteError: {status: false, message: ""},
    makeWebsiteLoading: false
}


const directoryControl = (state = initialState, action) => {
    switch (action.type) {
        case SET_SELECTION:
            return {
                ...state,
                selection: [...action.selection],
                makeWebsiteError: {
                    ...state.makeWebsiteError
                }
            }
        case SET_NEXT_STEP:
            return {
                ...state,
                step: action.step,
                makeWebsiteError: {
                    ...state.makeWebsiteError
                }
            }
        case SET_INDEX:
            return {
                ...state,
                index: action.index,
                makeWebsiteError: {
                    ...state.makeWebsiteError
                }
            }
        case SET_WEBSITE_URL:
            return {
                ...state,
                url: action.url,
                makeWebsiteError: {
                    ...state.makeWebsiteError
                }
            }
        case SET_MAKE_WEBSITE_LOADING:
            return {
                ...state,
                makeWebsiteLoading:  action.loading,
                makeWebsiteError: {
                    ...state.makeWebsiteError
                }
            }
        case SET_MAKE_WEBSITE_ERROR:
            return {
                ...state,
                makeWebsiteError: {
                    status: action.status,
                    message: action.message
                }
            }

        default:
            return state
    }
}

export default directoryControl