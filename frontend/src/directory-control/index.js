import React from "react";
import { connect } from "react-redux"
import {Button} from "antd";
import {selectIndex, selectSelection, selectStep} from "./selector";
import DirectoryTree from "../directory-display";
import DirectorySelect from "../directory-select";
import {makeWebsite, setNextStep} from "./action";

class DirectoryControl extends React.Component {
    constructor(props) {
        super(props)
    }

    componentDidMount() {

    }

    render() {
        return (
            <div>
                {this.props.step === 0?
                    <DirectoryTree/>
                   :
                   <DirectorySelect/>
                }

                {this.props.step === 0 ?
                    <Button className="directory-button" type="primary" onClick={() => this.props.setNextStep(1)}>Next</Button>
                    :
                <Button className="directory-button" type="primary" onClick={() => this.props.makeWebsite(this.props.index, this.props.selection)}>Make Website!</Button>
                }
            </div>
        )
    }
}

const mapStateToProps = state => {
    return {
        step: selectStep(state),
        index: selectIndex(state),
        selection: selectSelection(state)
    }
}

const mapDispatchToProps = dispatch => {
    return {
        setNextStep: (step) => dispatch(setNextStep(step)),
        makeWebsite: (indexPage, selection) => dispatch(makeWebsite(indexPage, selection))
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(DirectoryControl)