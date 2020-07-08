import request from "superagent";

export const SET_INDEX = 'SET_INDEX'
export const SET_SELECTION = 'SET_SELECTION'
export const SET_NEXT_STEP = 'NEXT_STEP'
export const SET_MAKE_WEBSITE_LOADING = 'SET_MAKE_WEBSITE_LOADING'
export const SET_MAKE_WEBSITE_ERROR = 'SET_MAKE_WEBSITE_ERROR'
export const SET_WEBSITE_URL = 'SET_WEBSITE_URL'

export const setSelection = selection => {
    return {
        type: SET_SELECTION,
        selection
    }
}

export const setNextStep = step => {
    return {
        type: SET_NEXT_STEP,
        step
    }
}
export const setIndex = blockId => {
    return {
        type: SET_INDEX,
        index: blockId
    }
}

export const setMakeWebsiteLoading = loading => {
    return {
        type: SET_MAKE_WEBSITE_LOADING,
        loading
    }
}

export const setMakeWebsiteError = (status, message) => {
    return {
        type: SET_MAKE_WEBSITE_ERROR,
        status,
        message
    }
}

export const setWebsiteURL = url => {
    return {
        type: SET_WEBSITE_URL,
        url
    }
}


export const makeWebsite = (index, selection) => {
    return dispatch => {
        dispatch(setMakeWebsiteLoading(true))
        let url = `http://127.0.0.1:5000/makeWebsite`
        const formattedSelection = selection.map(block => block.key)
        return request.post(url)
            .set('Content-Type', 'application/json')
            .withCredentials()
            .send({'index': index, 'selection': formattedSelection})
            .then(response => {
                dispatch(setWebsiteURL(response.body.url))
                dispatch(setNextStep(2))
            })
            .catch(err => {
                dispatch(setMakeWebsiteError(true, err.message))
            })
            .finally(() => {
                dispatch(setMakeWebsiteLoading(false))
            })
    }
}

