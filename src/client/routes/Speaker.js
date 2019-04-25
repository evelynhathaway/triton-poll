import React from "react";
import io from "socket.io-client";

import Join from "../components/speaker/Join";
import Voting from "../components/speaker/Voting";
import Placards from "../components/speaker/Placards";
import Attendance from "../components/speaker/Attendance";
import {AppContext, SpeakerContext} from "../contexts";


export default class Speaker extends React.Component {
    static contextType = AppContext

    state = {
        audience: [],
    }

    componentDidMount() {
        const socketAddress = (process.env.NODE_ENV === "development" ? "http://localhost:8080" : "") + "/speaker";
        // Create socket from `io`, assign to context
        this.socket = this.context.socket = io(socketAddress);

        this.socket.on("connect", this.context.connect.bind(this.context));
        this.socket.on("disconnect", this.context.disconnect.bind(this.context));
        this.socket.on("update state", this.context.updateState.bind(this.context));
    }

    componentWillUnmount() {
        this.socket.disconnect();
        this.context.socket = undefined;
    }

    get join() {
        return this.context.join;
    }
    get leave() {
        return this.context.leave;
    }

    render() {
        const {status, member} = this.context.state;
        const {roomCode} = member;

        return (
            <SpeakerContext.Provider value={this}>
                {
                    status === "connected" &&
                    (
                        roomCode && (
                            <>
                                {/* Voting actions and summary */}
                                <Voting/>
                                {/* Placards raised */}
                                <Placards/>
                                {/* Attendance and voting breakdown */}
                                <Attendance/>
                            </>
                        ) || (
                            <Join/>
                        )
                    )
                }
            </SpeakerContext.Provider>
        );
    }
};
