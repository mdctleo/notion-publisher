import {Option, Select, Tree} from "antd";
import {selectDirectoryData} from "../directory-input/selector";
import {setSelection} from "../directory-control/action";
import connect from "react-redux/es/connect/connect";
import React from "react";
import {selectSelection} from "../directory-control/selector";

const DirectorySelect = ({data, setSelection}) => {
    return (
        <Select
            showSearch
            style={{ width: 200 }}
            placeholder="Select a person"
            optionFilterProp="children"
            onChange={onChange}
            onFocus={onFocus}
            onBlur={onBlur}
            onSearch={onSearch}
            filterOption={(input, option) =>
                option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
            }
        >
            <Option value="jack">Jack</Option>
            <Option value="lucy">Lucy</Option>
            <Option value="tom">Tom</Option>
        </Select>
    )
}

const mapStateToProps = state => {
    return {
        data: selectSelection(state),
    }
}

const mapDispatchToProps = dispatch => {
    return {
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(DirectorySelect)

