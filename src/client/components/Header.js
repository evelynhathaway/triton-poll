import React from "react";
import {AppContext} from "../contexts/app-context";

export default class Header extends React.Component {
    static contextType = AppContext

    render() {
        const {leave} = this.props;
        const {status, committee, roomCode} = this.props.state;

        return (
            <header className="row">
                <div className="col-xs-10">
                    {committee && <h1>{committee}</h1>}
                    {roomCode && <p>{roomCode}</p>}
                    {roomCode && leave && <button className="btn btn-outline-dark" onClick={leave}>Leave</button>}
                </div>
                <div className="col-xs-2">
                    {status !== "connected" && <span id="connection-status">Disconnected</span>}
                </div>
            </header>
        );
    }
};
