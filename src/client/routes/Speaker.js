import React from "react";
import io from "socket.io-client";

import JoinSpeaker from "../components/JoinSpeaker";
import Attendance from "../components/Attendance";
import Questions from "../components/Questions";
import Header from "../components/Header";

import {AppContext} from "../contexts/app-context";
import {SpeakerContext} from "../contexts/speaker-context";


export default class Speaker extends React.Component {
    static contextType = AppContext

    state = {
        status: "disconnected",
        audience: [],
    }

    componentDidMount() {
        const socketAddress = (process.env.NODE_ENV === "development" ? "http://localhost:8080" : "") + "/speaker"
        // Create socket from `io`, assign to context
        this.socket = io(socketAddress);

        this.socket.on("connect", this.connect.bind(this));
        this.socket.on("disconnect", this.disconnect.bind(this));
        this.socket.on("update state", this.updateState.bind(this));
        this.socket.on("ask", this.ask.bind(this));
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
        const {roomCode} = sessionStorage;

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

    ask(question) {
        sessionStorage.answer = "";
        this.setState({
            currentQuestion: question,
            results: {a: 0, b: 0, c: 0, d: 0},
        });
    }

    render() {
        const {status, roomCode} = this.state;

        return (
            <SpeakerContext.Provider value={this}>
                <Header state={this.state} leave={this.leave.bind(this)}/>
                {
                    status === "connected" &&
                    (
                        roomCode && (
                            <>
                                <Questions/>
                                <Attendance/>
                            </>
                        ) || (
                            <JoinSpeaker/>
                        )
                    )
                }
            </SpeakerContext.Provider>
        );
    }
};
