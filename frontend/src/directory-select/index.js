import { Select } from "antd";
import connect from "react-redux/es/connect/connect";
import React from "react";
import {selectSelection} from "../directory-control/selector";

const { Option } = Select;


const DirectorySelect = ({data, setSelection}) => {
    return (
        <div>
            <Select
                showSearch
                style={{width: 200}}
                placeholder="Select a page to be index"
                optionFilterProp="children"
                filterOption={(input, option) =>
                    option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                }
            >
                {
                    this.props.selection.map((node) => {
                        return <Option value={node.id}>{node.title}</Option>
                    })
                }
            </Select>
        </div>
    )
}

const mapStateToProps = state => {
    return {
        selection: selectSelection(state),
    }
}

const mapDispatchToProps = dispatch => {
    return {
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(DirectorySelect)

