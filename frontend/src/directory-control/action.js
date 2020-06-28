import request from "superagent";

export const SET_INDEX = 'SET_INDEX'
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
export const setIndex = (blockId) => {
    return {
        type: SET_INDEX,
        index: blockId
    }
}


export const makeWebsite = (index, selection) => {
    return dispatch => {
        let url = `http://127.0.0.1:5000/makeWebsite`
        return request.post(url)
            .set('Content-Type', 'application/json')
            .withCredentials()
            .send({'index': index, 'selection': selection})
            .then(response => {
                console.log(response.body)
            })
            .catch(err => {
                console.log(err)
            })
    }
}

