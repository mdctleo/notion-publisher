import {connect} from "react-redux";
import {selectDirectoryData} from "../directory-input/selector";
import React from "react";
import {Button, Tree} from 'antd';
import {setSelection} from "../directory-control/action";

const DirectoryTree = ({data, setSelection}) => {
    return (
        <div>
            <Tree
                className="tree"
                checkable
                checkStrictly
                showIcon
                title="title_icon"
                treeData={data}
                options={{
                    label: 'title_icon',
                    children: 'children'
                }}
                onCheck={({checked, halfChecked}) => {
                    setSelection(checked)
                }}
            />
            {/*< Button type="primary">Next</Button>*/}
        </div>
    )
}

const mapStateToProps = state => {
    return {
        data: selectDirectoryData(state),
    }
}

const mapDispatchToProps = dispatch => {
    return {
        setSelection: (key) => dispatch(setSelection(key))
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(DirectoryTree)

