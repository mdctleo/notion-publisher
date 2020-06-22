import {CLEAR_INDEX_PAGE, SET_INDEX_PAGE, SET_SELECTION} from "./action";

export const initialState = {
    index: "",
    selection: []
}


const website = (state = initialState, action) => {

    switch (action.type) {
        case SET_INDEX_PAGE:
            return {
                ...state,
                index: action.index
            }
        case CLEAR_INDEX_PAGE:
            return {
                ...state,
                index: ""
            }
        case SET_SELECTION:
            return {
                ...state,
                selection: action.selection
            }

        default:
            return state
    }
}

export default website