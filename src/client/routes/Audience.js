import React from "react";
import io from "socket.io-client";

import Display from "../components/util/Display";
import Join from "../components/Join";
import Ask from "../components/Ask";
import Header from "../components/Header";

import {AppContext} from "../contexts/app-context";
import {AudienceContext} from "../contexts/audience-context";


export default class Audience extends React.Component {
    static contextType = AppContext

    state = {
        status: "disconnected",
    }

    componentDidMount() {
        const socketAddress = (process.env.NODE_ENV === "development" ? "http://localhost:8080" : "") + "/audience"
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
        const {roomCode, countryName} = sessionStorage;

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
        const {status, countryName, roomCode, currentQuestion} = this.state;

        return (
            <div>
                <AudienceContext.Provider value={this}>
                    <Header state={this.state} leave={this.leave.bind(this)}/>
                    <Display if={status === "connected"}>
                        <Display if={countryName && roomCode}>
                            <Display if={!currentQuestion}>
                                <h3>Welcome, {countryName}</h3>
                            </Display>
                            <Display if={currentQuestion}>
                                <Ask question={currentQuestion}/>
                            </Display>
                        </Display>

                        <Display if={!roomCode}>
                            <Join/>
                        </Display>
                    </Display>
                </AudienceContext.Provider>
            </div>
        );
    }
};
