import { Select } from "antd";
import connect from "react-redux/es/connect/connect";
import React from "react";
import {selectSelection} from "../directory-control/selector";
import {setIndex} from "../directory-control/action";

const { Option } = Select;


const DirectorySelect = ({selection, setIndexPage}) => {
    return (
        <div>
            <Select
                showSearch
                style={{width: 200}}
                placeholder="Select a page to be the index page"
                onSelect={(blockId) => setIndexPage(blockId)}
            >
                {
                    selection.map((node) => {
                        return <Option key={node.key} value={node.key}>{node.icon} {node.title}</Option>
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
        setIndexPage: (blockId) => dispatch(setIndex(blockId))
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(DirectorySelect)

