import {Tree} from "element-react";
import {connect} from "react-redux";
import {selectDirectoryData} from "../directory-input/selector";
import React from "react";

const DirectoryTree = ({data}) => {
    return (
        <Tree
            className="tree"
            data={data}
            options={{
                label: 'title_icon',
                children: 'children'
            }}
            emptyText="No data"
            highlightCurrent={true}
        />
    )
}

const mapStateToProps = state => {
    return {
        data: selectDirectoryData(state)
    }
}

const mapDispatchToProps = dispatch => {
    return {

    }
}

export default connect(mapStateToProps, mapDispatchToProps)(DirectoryTree)

