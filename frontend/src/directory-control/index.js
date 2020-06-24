import React from "react";
import { connect } from "react-redux"
import {Button} from "antd";
import {selectStep} from "./selector";
import DirectoryTree from "../directory-display";

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
                   <Select></Select>
                }

                {this.props.step === 0 ? <Button type="primary">Next</Button>
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
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(DirectoryControl)