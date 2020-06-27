import {SET_NEXT_STEP, SET_INDEX, SET_SELECTION} from "./action";

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
        case SET_NEXT_STEP:
            return {
                ...state,
                step: action.step
            }
        case SET_INDEX:
            return {
                ...state,
                index: action.index
            }

        default:
            return state
    }
}

export default directoryControl