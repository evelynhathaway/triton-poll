import React from "react";
import Display from "./Display";

export default class Header extends React.Component {
    render() {
        return (
            <header className="row">
                <Display if={this.props.member}>
                    <div className="col-xs-10">
                        <h1>{this.props.committee}</h1>
                        <p>{this.props.roomCode}</p>
                    </div>
                </Display>

                <Display if={this.props.status !== "connected"}>
                    <div className="col-xs-2">
                        <span id="connection-status">Disconnected</span>
                    </div>
                </Display>
            </header>
        );
    }
};
