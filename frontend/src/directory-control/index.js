import React from "react";
import {connect} from "react-redux"
import {Alert, Button, Result, Spin} from "antd";
import {
    selectIndex,
    selectMakeWebsiteError,
    selectMakeWebsiteLoading,
    selectSelection,
    selectStep,
    selectUrl
} from "./selector";
import DirectoryTree from "../directory-display";
import DirectorySelect from "../directory-select";
import {makeWebsite, setMakeWebsiteError, setNextStep} from "./action";
import {selectDirectoryData, selectDirectoryError, selectDirectoryLoading} from "../directory-input/selector";
import {setDirectoryError} from "../directory-input/action";

class DirectoryControl extends React.Component {
    constructor(props) {
        super(props)
    }

    componentDidMount() {

    }

    // TODO: look at incorporating react router instead of using conditional rendering
    render() {
        const directoryLoading = this.props.directoryLoading
        const makeWebsiteLoading = this.props.makeWebsiteLoading
        const directoryError = this.props.directoryError
        const makeWebsiteError = this.props.makeWebsiteError
        return (
            <div>
                {directoryError.status && <Alert
                    className="alert"
                    message="Error"
                    description={directoryError.message}
                    type="error"
                    showIcon
                    closable
                    onClose={(e) => {
                        this.props.setDirectoryError(false, "")
                    }}
                />}
                {makeWebsiteError.status && <Alert
                    className="alert"
                    message="Error"
                    description={makeWebsiteError.message}
                    type="error"
                    showIcon
                    closable
                    onClose={(e) => {
                        this.props.setMakeWebsiteError(false, "")
                    }}
                />}
                <Spin size="large" tip="this might take a while..." spinning={directoryLoading || makeWebsiteLoading}>
                    {
                        this.props.step === 0 &&
                        <div>
                            <DirectoryTree/>
                            <Button className="directory-button" type="primary"
                                    disabled={this.props.treeData.length === 0}
                                    onClick={() => this.props.setNextStep(1)}>Next</Button>
                        </div>

                    }
                    {this.props.step === 1 &&
                    <div>
                        <DirectorySelect/>
                        <Button className="directory-button" type="primary"
                                onClick={() => this.props.makeWebsite(this.props.index, this.props.selection)}>Make
                            Website!</Button>
                    </div>
                    }
                    {
                        this.props.step === 2 &&
                        <div>
                            <Result
                                status="success"
                                title={this.props.url}
                                subTitle="Your site is now deployed, write down the url!"
                            />
                        </div>
                    }
                </Spin>
            </div>
        )
    }
}

const mapStateToProps = state => {
    return {
        step: selectStep(state),
        index: selectIndex(state),
        selection: selectSelection(state),
        treeData: selectDirectoryData(state),
        directoryLoading: selectDirectoryLoading(state),
        makeWebsiteLoading: selectMakeWebsiteLoading(state),
        directoryError: selectDirectoryError(state),
        makeWebsiteError: selectMakeWebsiteError(state),
        url: selectUrl(state)
    }
}

const mapDispatchToProps = dispatch => {
    return {
        setNextStep: (step) => dispatch(setNextStep(step)),
        makeWebsite: (indexPage, selection) => dispatch(makeWebsite(indexPage, selection)),
        setDirectoryError: (status, message) => dispatch(setDirectoryError(status, message)),
        setMakeWebsiteError: (status, message) => dispatch(setMakeWebsiteError(status, message))
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(DirectoryControl)