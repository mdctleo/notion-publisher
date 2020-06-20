export const GET_DIRECTORY = 'GET_DIRECTORY'
export const RECEIVE_DIRECTORY = 'RECEIVE_DIRECTORY'


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


export const fetchDirectory = (tokenV2) => {
    return dispatch => {
        // dispatch(setDependencyLoading(true))
        dispatch(getDirectory(tokenV2))
        let url = `/getDirectory`
        return request.post(url)
            .send({'token_v2': tokenV2})
            .then(response => {
                // dispatch(setDependencyLoading(false))
                dispatch(receiveDirectory(response.body))
            })
            .catch(err => {
                console.log(err)
                // dispatch(setDependencyLoading(false))
                // dispatch(setDependencyError(true, err.message))
            })
    }
}