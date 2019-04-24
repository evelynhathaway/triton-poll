import React from "react";
import {AppContext} from "../contexts";


export default class Header extends React.Component {
    static contextType = AppContext

    render() {
        const {committee, roomCode} = this.props.state;

        return (
            <header id="header-text">
                {/* Conference name, committee */}
                <div className="float-left">
                    <h1>Triton MUN</h1>
                    {committee && <p>{committee}</p>}
                </div>

                {/* Room code */}
                <div className="float-right">
                    {roomCode && <h1>{roomCode}</h1>}
                    {roomCode && <p>Room Code</p>}
                </div>
            </header>
        );
    }
};
