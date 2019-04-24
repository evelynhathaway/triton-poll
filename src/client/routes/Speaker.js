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
        status: "disconnected",
        audience: [],
        roomCode: sessionStorage.roomCode,
        votes: {
            get total() {
                return Object.keys(this).reduce((accumulator, key) => key !== "total" && accumulator + (this[key].amount || 0), 0);
            },
            yes: 0,
            no: 0,
            abstain: 0,
        },
    }

    componentDidMount() {
        const socketAddress = (process.env.NODE_ENV === "development" ? "http://192.168.86.2:8080" : "") + "/speaker";
        // Create socket from `io`, assign to context
        this.socket = io(socketAddress);

        this.socket.on("connect", this.connect.bind(this));
        this.socket.on("disconnect", this.disconnect.bind(this));
        this.socket.on("update state", this.updateState.bind(this));
    }

    componentWillUnmount() {
        this.socket.disconnect();
    }

    updateState(state) {
        // Store room if set
        if (typeof state.roomCode !== "undefined") {
            sessionStorage.roomCode = state.roomCode;
        }

        // Forward to React
        this.setState(state);
    }

    connect() {
        const {roomCode} = this.state;

        if (roomCode) {
            this.join({roomCode});
        }

        this.setState({
            status: "connected",
        });
    }
    disconnect() {
        this.setState({
            status: "disconnected",
        });
    }

    join({roomCode}) {
        // Ask server to join as a speaker in `roomCode`
        this.socket.emit("join", {roomCode}, error => alert(error));
    }
    leave() {
        // Ask server to leave `roomCode`
        this.socket.emit("leave", {roomCode: this.state.roomCode});
    }

    render() {
        const {status, roomCode} = this.state;

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
