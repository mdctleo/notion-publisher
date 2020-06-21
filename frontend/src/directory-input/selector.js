import { createSelector } from 'reselect'
import { initialState } from './reducer'

const selectDirectory = state => state.directory || initialState

const selectDirectoryData = createSelector(
    selectDirectory,
    directory => directory.data
)

const selectTokenV2 = createSelector(
    selectDirectory,
    directory => directory.form.tokenV2
)

const selectWorkspace = createSelector(
    selectDirectory,
    directory => directory.form.workspace
)

const selectTokenV2Rule = createSelector(
    selectDirectory,
    directory => directory.rules.tokenV2
)

const selectWorkspaceRule = createSelector(
    selectDirectory,
    directory => directory.rules.workspace
)

const selectForm = createSelector(
    selectDirectory,
    directory => directory.form
)

const selectRules = createSelector(
    selectDirectory,
    directory => directory.rules
)

export {selectDirectoryData, selectTokenV2, selectWorkspace, selectTokenV2Rule, selectWorkspaceRule, selectForm, selectRules}