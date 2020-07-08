import {
    GET_DIRECTORY,
    RECEIVE_DIRECTORY,
    SET_DIRECTORY_ERROR,
    SET_DIRECTORY_LOADING,
    SET_TOKENV2,
    SET_WORKSPACE
} from "./action";

export const initialState = {
    data: [],
    directoryLoading: false,
    directoryError: {status: false, message: ""},
    form: {
        tokenV2: "",
    },
    rules: {
        tokenV2: [
            {required: true, message: 'Please input your token', trigger: 'blur'},
        ],
    }
}


const directory = (state = initialState, action) => {
    switch (action.type) {
        case RECEIVE_DIRECTORY:
            return {
                ...state,
                data: action.data.children,
                directoryError: {
                    ...state.directoryError
                },
                form: {
                    ...state.form
                },
                rules: {
                    ...state.rules
                }
            }
        case SET_TOKENV2:
            return {
                ...state,
                directoryError: {
                    ...state.directoryError
                },
                form: {
                    ...state.form,
                    tokenV2: action.tokenV2
                },
                rules: {
                    ...state.rules
                }
            }
        case SET_DIRECTORY_LOADING:
            return {
                ...state,
                directoryLoading: action.loading,
                directoryError: {
                    ...state.directoryError
                },
                form: {
                    ...state.form,
                },
                rules: {
                    ...state.rules
                }
            }
        case SET_DIRECTORY_ERROR:
            return {
                ...state,
                directoryError: {
                    status: action.status,
                    message: action.message
                },
                form: {
                    ...state.form
                },
                rules: {
                    ...state.rules
                }


            }
        default:
            return state
    }
}

export default directory