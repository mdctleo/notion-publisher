import request from 'superagent'

export const GET_DIRECTORY = 'GET_DIRECTORY'
export const RECEIVE_DIRECTORY = 'RECEIVE_DIRECTORY'
export const SET_TOKENV2 = 'SET_TOKENV2'
export const SET_WORKSPACE = 'SET_WORKSPACE'
export const SET_DIRECTORY_LOADING = 'SET_DIRECTORY_LOADING'
export const SET_DIRECTORY_ERROR = 'SET_DIRECTORY_ERROR'


export const getDirectory = (tokenV2) => {
    return {
        type: GET_DIRECTORY,
        tokenV2
    }
}

export const receiveDirectory = (data) => {
    return {
        type: RECEIVE_DIRECTORY,
        data
    }
}


export const setTokenV2 = (tokenV2) => {
    return {
        type: SET_TOKENV2,
        tokenV2
    }
}

export const setWorkspace = (workspace) => {
    return {
        type: SET_WORKSPACE,
        workspace
    }
}

export const setDirectoryLoading = (loading) => {
    return {
        type: SET_DIRECTORY_LOADING,
        loading
    }
}

export const setDirectoryError = (status, message) => {
    return {
        type: SET_DIRECTORY_ERROR,
        status,
        message
    }
}

export const fetchDirectory = (tokenV2) => {
    return dispatch => {
        dispatch(setDirectoryLoading(true))
        let url = `http://127.0.0.1:5000/getDirectory`
        return request.post(url)
            .set('Content-Type', 'application/json')
            .withCredentials()
            .send({'token_V2': tokenV2})
            .then(response => {
                dispatch(receiveDirectory(response.body))
            })
            .catch(err => {
                dispatch(setDirectoryError(true, err.response.body.msg))
            })
            .finally(() => {
                dispatch(setDirectoryLoading(false))
            })
    }
}