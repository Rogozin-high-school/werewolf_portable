import React, { Component } from "react";

import { RoleImages, RoleNames } from "../Game";

import posed from "react-pose";

var TriedImage = posed.img({
    visible: {
        top: 0
    },
    hidden: {
        top: "100%",
        transition: {
            duration: 1000
        }
    }
})

class ExecutionView extends Component {

    constructor(props) {
        super(props);

        this.state = {
            imgshown: "visible"
        };
    }

    componentDidMount() {
        this.timeout = setTimeout(() => {
            this.timeout = null;
            this.setState({
                imgshown: "hidden"
            })
        }, 3000);
    }

    componentWillUnmount() {
        if (this.timeout)
            clearTimeout(this.timeout());
    }

    render() {
        return (
            <center>
                <div className="ui card">
                    <div className="image" style={{overflow: "hidden"}}>
                        <img src={ "https://i.imgur.com/D4Lko8G.png" }/>
                        <TriedImage src={ this.props.player.img } style={styles.overlapping}
                            pose={ this.state.imgshown }/>
                    </div>
                    <div className="content">
                        <div className="header">
                            The town has decided to execute { this.props.player.name }.
                        </div>
                    </div>
                    <div className="content" style={{ fontStyle: "italic", color: "black" }}>
                        May god have mercy on your soul, { this.props.player.name }
                    </div>
                </div>
            </center>
        )
    }

}

const styles = {
    overlapping: {
        position: "absolute",
        top: 0,
        left: 0
    }
}

export default ExecutionView;