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
                    {/* TODO: proper size */}
                    <img alt="Triton MUN logo" src="/img/MUN Logo Final.png"/>
                    <div className="header-large">Triton MUN</div>
                    {committee && <div className="header-small">{committee}</div>}
                </div>

                {/* Room code */}
                <div className="float-right header-right">
                    {roomCode && (
                        <>
                            <div className="header-large">{roomCode}</div>
                            <div className="header-small">Room Code</div>
                        </>
                    )}
                </div>
            </header>
        );
    }
};
