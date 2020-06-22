import {createSelector} from "reselect";
import {initialState} from "../directory-input/reducer";

const selectDirectoryControl = state => state.directoryControl || initialState


export const selectSelection = createSelector(
    selectDirectoryControl,
    directoryControl => directoryControl.selection
)

export const selectStep = createSelector(
    selectDirectoryControl,
    directoryControl => directoryControl.step
)
