import React from "react";
import { connect } from "react-redux"
import {Button} from "antd";
import {selectStep} from "./selector";
import DirectoryTree from "../directory-display";
import DirectorySelect from "../directory-select";
import {setNextStep} from "./action";

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
                    <Button type="primary" onClick={() => this.props.setNextStep(1)}>Next</Button>
                    :
                <Button type="primary">Make Website!</Button>
                }
            </div>
        )
    }
}

const mapStateToProps = state => {
    return {
        step: selectStep(state)
    }
}

const mapDispatchToProps = dispatch => {
    return {
        setNextStep: (step) => dispatch(setNextStep(step))
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(DirectoryControl)