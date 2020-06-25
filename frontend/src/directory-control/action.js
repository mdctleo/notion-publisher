import request from "superagent";

export const SET_INDEX_PAGE = 'SET_INDEX_PAGE'
export const SET_SELECTION = 'SET_SELECTION'
export const SET_NEXT_STEP = 'NEXT_STEP'

export const setSelection = (selection) => {
    return {
        type: SET_SELECTION,
        selection
    }
}

export const setNextStep = (step) => {
    return {
        type: SET_NEXT_STEP,
        step
    }
}
export const setIndexPage = (blockId) => {
    return {
        type: SET_INDEX_PAGE,
        index: blockId
    }
}


export const makeWebsite = (index, blockIds) => {
    return dispatch => {
        // dispatch(setDependencyLoading(true))
        // dispatch(getDirectory(tokenV2))
        let url = `http://127.0.0.1:5000/makeWebsite`
        return request.post(url)
            .set('Content-Type', 'application/json')
            .send({'index': index, 'selection': blockIds})
            .then(response => {
                // dispatch(setDependencyLoading(false))
                console.log(response.body)
            })
            .catch(err => {
                console.log(err)
                // dispatch(setDependencyLoading(false))
                // dispatch(setDependencyError(true, err.message))
            })
    }
}

