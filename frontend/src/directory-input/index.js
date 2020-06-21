import React from "react";
import { connect } from "react-redux"
import {fetchDirectory, setTokenV2, setWorkspace} from "./action";
import {Button, Form, Input} from "element-react";
import {
    selectDirectoryData,
    selectForm, selectRules,
    selectTokenV2,
    selectTokenV2Rule,
    selectWorkspace,
    selectWorkspaceRule
} from "./selector";


class DirectoryInput extends React.Component {
    constructor(props) {
        super(props)
    }

    componentDidMount() {

    }

    render() {
        return (
            <Form ref="form" model={this.props.form} rules={this.props.rules} labelWidth="120" className="form">
                <Form.Item label="Your token" prop="tokenV2">
                    <Input value={this.props.tokenV2} onChange={event => this.props.setTokenV2(event)} autoComplete="off" />
                </Form.Item>
                <Form.Item label="A link to your workspace" prop="workspace">
                    <Input value={this.props.workspace} onChange={(value) => this.props.setWorkspace(value)} autoComplete="off" />
                </Form.Item>
                <Form.Item>
                    <Button type="primary" onClick={() => this.props.fetchDirectory(this.props.tokenV2, this.props.workspace)}>Submit</Button>
                </Form.Item>
            </Form>
        )
    }
}

const mapStateToProps = state => {
    return {
        data: selectDirectoryData(state),
        tokenV2: selectTokenV2(state),
        workspace: selectWorkspace(state),
        tokenV2Rule: selectTokenV2Rule(state),
        workspaceRule: selectWorkspaceRule(state),
        form: selectForm(state),
        rules: selectRules(state)
    }
}

const mapDispatchToProps = dispatch => {
    return {
        fetchDirectory: (tokenV2, workspace) => dispatch(fetchDirectory(tokenV2, workspace)),
        setTokenV2: (tokenV2) => dispatch(setTokenV2(tokenV2)),
        setWorkspace: (workspace) => dispatch(setWorkspace(workspace))
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(DirectoryInput)