import React from "react";
import { connect } from "react-redux"
import {fetchDirectory, setTokenV2, setWorkspace} from "./action";
// import {Button, Form, Input} from "element-react";
import { Form, Input, Button } from 'antd';

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
            <Form layout="vertical" className="form" onFinish={({ tokenV2 }) => this.props.fetchDirectory(tokenV2)}>
                <Form.Item label="Your token:" name="tokenV2" rules={[{ required: true, message: 'Please input your token!' }]}>
                    <Input />
                </Form.Item>
                {/*<Form.Item label="A link to your workspace" prop="workspace">*/}
                    {/*<Input value={this.props.workspace} onChange={(value) => this.props.setWorkspace(value)} autoComplete="off" />*/}
                {/*</Form.Item>*/}
                <Form.Item>
                    <Button type="primary" htmlType="submit">Submit</Button>
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
        fetchDirectory: (tokenV2) => dispatch(fetchDirectory(tokenV2)),
        setTokenV2: (tokenV2) => dispatch(setTokenV2(tokenV2)),
        setWorkspace: (workspace) => dispatch(setWorkspace(workspace))
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(DirectoryInput)