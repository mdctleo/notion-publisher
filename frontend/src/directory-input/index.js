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
            <Form ref="form" model={this.props.form} rules={this.props.rules} labelWidth="100" className="demo-ruleForm">
                <Form.Item label="Your notion token" prop="pass">
                    <Input value={this.props.tokenV2} onChange={event => this.props.setTokenV2(event)} autoComplete="off" />
                </Form.Item>
                <Form.Item label="A link to your notion workspace" prop="checkPass">
                    <Input value={this.props.workspace} onChange={(value) => this.props.setWorkspace(value)} autoComplete="off" />
                </Form.Item>
                <Form.Item>
                    <Button type="primary">Submit</Button>
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
        fetchDirectory: () => dispatch(fetchDirectory()),
        setTokenV2: (tokenV2) => dispatch(setTokenV2(tokenV2)),
        setWorkspace: (workspace) => dispatch(setWorkspace(workspace))
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(DirectoryInput)