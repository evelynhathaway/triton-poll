import React from "react";
import io from "socket.io-client";

import Join from "../components/audience/Join";
import Placard from "../components/audience/Placard";
import Voting from "../components/audience/Voting";
import {AppContext, AudienceContext} from "../contexts";


export default class Audience extends React.Component {
    static contextType = AppContext

    state = {
        status: "disconnected",
        roomCode: sessionStorage.roomCode,
        countryName: sessionStorage.countryName,
    }

    componentDidMount() {
        const socketAddress = (process.env.NODE_ENV === "development" ? "http://192.168.86.2:8080" : "") + "/audience";
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
        // Store room and country name if set
        if (typeof state.roomCode !== "undefined") {
            sessionStorage.roomCode = state.roomCode;
        }
        if (typeof state.countryName !== "undefined") {
            sessionStorage.countryName = state.countryName;
        }

        // Forward to React
        this.setState(state);
    }

    connect() {
        const {roomCode, countryName} = this.state;

        if (roomCode && countryName) {
            this.join({countryName, roomCode});
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

    join({countryName, roomCode}) {
        // Ask server to join as `countryName` in `roomCode`
        this.socket.emit("join", {countryName, roomCode}, error => alert(error));
    }
    leave() {
        // Ask server to leave `roomCode`
        this.socket.emit("leave", {roomCode: this.state.roomCode});
    }

    render() {
        const {status, countryName, roomCode} = this.state;

        return (
            <AudienceContext.Provider value={this}>
                {
                    status === "connected" && (
                        roomCode && countryName && (
                            <>
                                <Placard/>
                                <Voting/>
                            </>
                        ) || (
                            <Join/>
                        )
                    )
                }
            </AudienceContext.Provider>
        );
    }
}
