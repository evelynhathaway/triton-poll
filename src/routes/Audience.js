import React from "react";
import io from "socket.io-client";

import Display from "../components/util/Display";
import Join from "../components/Join";
import Ask from "../components/Ask";
import {AppContext} from "../contexts/app-context";

export default class Audience extends React.Component {
    static contextType = AppContext

    componentWillMount() {
        // Create socket from `io`, assign to context
        const socket = this.context.socket = io("http://localhost:3000/audience"); // TODO: change on `env`: prod|dev

        socket.on("connect", this.context.connect.bind(this.context));
        socket.on("reconnect", this.context.reconnect.bind(this.context));
        socket.on("disconnect", this.context.disconnect.bind(this.context));
    }

    render() {
        const {status, member, audience, currentQuestion} = this.context.state;

        return (
            <div>
                <Display if={status === "connected"}>
                    <Display if={member.countryName}>
                        <Display if={!currentQuestion}>
                            <h3>Welcome, {member.countryName}</h3>
                            <p>{audience.length} audience members connected</p>
                        </Display>
                        <Display if={currentQuestion}>
                            <Ask question={currentQuestion}/>
                        </Display>
                    </Display>

                    <Display if={!member.countryName}>
                        <h2>Join a room</h2>
                        <Join/>
                    </Display>
                </Display>
            </div>
        );
    }
};
