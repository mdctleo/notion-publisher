// import {Button, Tree} from "element-react";
import {connect} from "react-redux";
import {selectDirectoryData} from "../directory-input/selector";
import React from "react";
import {selectWebsiteIndex} from "./selector";
import {setIndexPage} from "./action";
import {Button, Tree } from 'antd';


const renderContent = (nodeModel, data, store) => {
    console.log(store)
    return (
        <span>
            <span>
                <span>{data.title_icon}</span>
            </span>
        <span style={{float: 'right', marginRight: '20px'}}>
            <Button size="mini" plain={false} onClick={(event) => setIndexPage(data.blockId)}>Index</Button>
        </span>
        </span>
    );
}


const DirectoryTree = ({data, index, setIndexPage}) => {
    return (
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
            emptyText="No data"
            renderContent={(...args) => renderContent(...args)}
        />
    )
}

const mapStateToProps = state => {
    return {
        data: selectDirectoryData(state),
        index: selectWebsiteIndex
    }
}

const mapDispatchToProps = dispatch => {
    return {
        setIndexPage: (blockId) => dispatch(setIndexPage(blockId))
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(DirectoryTree)

