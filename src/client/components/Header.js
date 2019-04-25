import React from "react";
import {AppContext} from "../contexts";


export default class Header extends React.Component {
    static contextType = AppContext

    render() {
        const {committee, member} = this.context.state;
        const {roomCode} = member;

        return (
            <header id="header">
                {/* Conference name, committee */}
                <div className="float-left">
                    <img alt="Triton MUN logo" src="/img/logo-small.png"/>
                    <span className="d-inline-block align-middle">
                        <div className="header-large">Triton MUN</div>
                        {committee && (
                            <div className="header-small">{committee}
                                {roomCode && (
                                    <span className="room-code-small"> ({roomCode})</span>
                                )}
                            </div>
                        )}
                    </span>
                </div>

                {/* Room code */}
                <div className="float-right header-right">
                    {roomCode && (
                        <span className="d-inline-block align-middle">
                            <div className="header-large">{roomCode}</div>
                            <div className="header-small">Room Code</div>
                        </span>
                    )}
                </div>
            </header>
        );
    }
};
