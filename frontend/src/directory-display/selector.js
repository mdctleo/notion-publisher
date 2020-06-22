import { createSelector } from 'reselect'
import { initialState } from './reducer'

const selectWebsite = state => state.website || initialState

const selectWebsiteIndex= createSelector(
    selectWebsite,
    website => website.index
)

export {selectWebsiteIndex}