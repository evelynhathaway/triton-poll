import React from "react";
import io from "socket.io-client";

import Display from "../components/util/Display";
import JoinSpeaker from "../components/JoinSpeaker";
import Attendance from "../components/Attendance";
import Questions from "../components/Questions";
import {AppContext} from "../contexts/app-context";

export default class Speaker extends React.Component {
    static contextType = AppContext

    state = {
        audience: [],
        results: {},
    }

    componentWillMount() {
        const socketAddress = (process.env.NODE_ENV === "development" ? "http://localhost:8080" : "") + "/speaker"
        // Create socket from `io`, assign to context
        const socket = this.context.socket = io(socketAddress);

        socket.on("connect", this.context.connect.bind(this.context));
        socket.on("reconnect", this.context.reconnect.bind(this.context));
        socket.on("disconnect", this.context.disconnect.bind(this.context));
        socket.on("update state", this.context.updateState.bind(this.context));
        socket.on("update speaker state", this.updateState.bind(this));
        socket.on("joined", this.context.joined.bind(this.context));
        socket.on("start", this.context.start.bind(this.context));
        socket.on("end", this.context.updateState.bind(this.context));
        socket.on("ask", this.context.ask.bind(this.context));
    }

    start(presentation) {
        // TODO:
        // window.addEventListener('beforeunload', function (e) {
        //     // Cancel the event
        //     e.preventDefault();
        //     // Chrome requires returnValue to be set
        //     e.returnValue = '';
        // });
        if (this.state.member.type === "speaker") {
            sessionStorage.title = presentation.title;
        }
        this.setState(presentation);
    }

    ask(question) {
        sessionStorage.answer = "";
        this.setState({
            currentQuestion: question,
            results: {a: 0, b: 0, c: 0, d: 0},
        });
    }

    render() {
        const {status, member, audience, questions} = this.context.state;

        return (
            <div>
                <Display if={status === "connected"}>
                    <Display if={member.name && member.type === "speaker"}>
                        <Questions questions={questions}/>
                        <Attendance audience={audience}/>
                    </Display>

                    <Display if={!member.name}>
                        <h2>Create a room</h2>
                        <JoinSpeaker/>
                    </Display>
                </Display>
            </div>
        );
    }
};
