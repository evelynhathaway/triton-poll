import React from "react";


export default class Display extends React.Component {
    render() {
        return (
            <>
                {this.props.if ? this.props.children : null}
            </>
        );
    }
};
