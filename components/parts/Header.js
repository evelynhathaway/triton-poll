import React from "react";
import Display from "./Display";
import {AppContext} from "../../app-context";

export default class Header extends React.Component {
    static contextType = AppContext

    render() {
        const {status, member, committee, roomCode} = this.context.state;

        return (
            <header className="row">
                <Display if={member}>
                    <div className="col-xs-10">
                        <h1>{committee}</h1>
                        <p>{roomCode}</p>
                    </div>
                </Display>

                <Display if={status !== "connected"}>
                    <div className="col-xs-2">
                        <span id="connection-status">Disconnected</span>
                    </div>
                </Display>
            </header>
        );
    }
};
