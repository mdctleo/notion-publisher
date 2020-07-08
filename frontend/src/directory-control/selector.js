import {createSelector} from "reselect";
import {initialState} from "./reducer";

const selectDirectoryControl = state => state.directoryControl || initialState


export const selectSelection = createSelector(
    selectDirectoryControl,
    directoryControl => directoryControl.selection
)

export const selectStep = createSelector(
    selectDirectoryControl,
    directoryControl => directoryControl.step
)

export const selectIndex = createSelector(
    selectDirectoryControl,
    directoryControl => directoryControl.index
)

export const selectUrl = createSelector(
    selectDirectoryControl,
    directoryControl => directoryControl.url
)

export const selectMakeWebsiteLoading = createSelector(
    selectDirectoryControl,
    directoryControl => directoryControl.makeWebsiteLoading
)

export const selectMakeWebsiteError = createSelector(
    selectDirectoryControl,
    directoryControl => directoryControl.makeWebsiteError
)
