import request from 'superagent'

export const GET_DIRECTORY = 'GET_DIRECTORY'
export const RECEIVE_DIRECTORY = 'RECEIVE_DIRECTORY'
export const SET_TOKENV2 = 'SET_TOKENV2'
export const SET_WORKSPACE = 'SET_WORKSPACE'


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

export const fetchDirectory = (tokenV2) => {
    return dispatch => {
        // dispatch(setDependencyLoading(true))
        dispatch(getDirectory(tokenV2))
        let url = `http://127.0.0.1:5000/getDirectory`
        return request.post(url)
            .set('Content-Type', 'application/json')
            .send({'token_V2': tokenV2})
            .then(response => {
                // dispatch(setDependencyLoading(false))
                console.log(response.body)
                dispatch(receiveDirectory(response.body))
            })
            .catch(err => {
                console.log(err)
                // dispatch(setDependencyLoading(false))
                // dispatch(setDependencyError(true, err.message))
            })
    }
}