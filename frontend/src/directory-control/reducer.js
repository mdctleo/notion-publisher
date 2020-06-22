import {NEXT_STEP, SET_INDEX_PAGE, SET_SELECTION} from "./action";

export const initialState = {
    selection: [],
    step: 0,
    index: "",
}


const directoryControl = (state = initialState, action) => {
    switch (action.type) {
        case SET_SELECTION:
            return {
                ...state,
                selection: [...action.selection]
            }
        case NEXT_STEP:
            return {
                ...state,
                step: state.step + 1
            }
        case SET_INDEX_PAGE:
            return {
                ...state,
                index: action.index
            }

        default:
            return state
    }
}

export default directoryControl