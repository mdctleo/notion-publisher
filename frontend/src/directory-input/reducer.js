import {GET_DIRECTORY, RECEIVE_DIRECTORY, SET_TOKENV2, SET_WORKSPACE} from "./action";

export const initialState = {
    data: [],
    directoryLoading: false,
    directoryError: false,
    form: {
        tokenV2: "",
        workspace: ""
    },
    rules: {
        tokenV2: [
            {required: true, message: 'Please input your token', trigger: 'blur'},
        ],
        workspace: [
            {required: true, message: "Please input a link to your workplace", trigger: 'blur'}
        ]

    }
}



const directory = (state = initialState, action) => {
    switch (action.type) {
        case GET_DIRECTORY:
            return {
                ...state,
                form: {
                    ...state.form
                },
                rules: {
                    ...state.rules
                }
            }
        case RECEIVE_DIRECTORY:
            return {
                ...state,
                data: action.data.children,
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
                form: {
                    ...state.form,
                    tokenV2: action.tokenV2
                },
                rules: {
                    ...state.rules
                }
            }
        case SET_WORKSPACE:
            return {
                ...state,
                form: {
                    ...state.form,
                    workspace: action.workspace
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