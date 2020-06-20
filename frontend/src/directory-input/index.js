import React from "react";
import { connect } from "react-redux"
import {fetchDirectory} from "./action";


class DependencyControls extends React.Component {
    constructor(props) {
        super(props)
    }

    componentDidMount() {
        let ctx = this.canvas.getContext("2d")
        let grd = ctx.createLinearGradient(0, 0, 200, 0)

        for (let i = 0; i < d3.schemeRdYlGn[10].length; i++) {
            grd.addColorStop((i / 10).toFixed(1), d3.schemeRdYlGn[10][i])
        }

        ctx.fillStyle = grd
        ctx.fillRect(10, 10, 150, 80)
    }

    render() {
        const isError = this.props.isError
        return (
            <div>
                <div className="dependency-control">
                    <Search
                        placeholder="input search text"
                        onSearch={(value, event) => {
                            this.props.fetchDependencies(value, "latest")
                        }}
                        style={{width: 200, marginRight: 20}}
                    />
                    <div className="dependency-legend">
                        <canvas ref={canvas => this.canvas = canvas} width="170" height="30"/>
                        <span className="low">Low Score</span>
                        <span className="high">High Score</span>
                    </div>
                </div>
                {isError && <Alert
                    className="alert"
                    message="Error"
                    description="Something went wrong, try refreshing the page and retry"
                    type="error"
                    showIcon
                    closable
                    onClose={(e) => {this.props.setError(false, "")}}
                />}
            </div>
        )
    }
}

const mapStateToProps = state => {
    return {
        data: selectDependencyData(state),
        isError: selectDependencyError(state)
    }
}

const mapDispatchToProps = dispatch => {
    return {
        fetchDependencies: (packageName, version) => dispatch(fetchDependencies(packageName, version)),
        setError: (isError, message) => dispatch(setDependencyError(isError, message))
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(DependencyControls)