import React from "react";
import io from "socket.io-client";

import Join from "../components/audience/Join";
import Placard from "../components/audience/Placard";
import Voting from "../components/audience/Voting";
import {AppContext, AudienceContext} from "../contexts";


export default class Audience extends React.Component {
    static contextType = AppContext

    state = {
        voting: false,
        placard: {
            rasied: false,
            timeRaised: null,
        },
    }

    componentDidMount() {
        const socketAddress = (process.env.NODE_ENV === "development" ? "http://localhost:8080" : "") + "/audience";
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

    // TODO: better sharing of methods using imported functions/etc
    get join() {
        return this.context.join;
    }
    get leave() {
        return this.context.leave;
    }

    render() {
        const {status, member} = this.context.state;
        const {countryName, roomCode} = member;

        return (
            <AudienceContext.Provider value={this}>
                {
                    status === "connected" && (
                        roomCode && countryName && (
                            <>
                                <Placard member={this.context.state.member} placard={this.state.placard}/>
                                <Voting voting={this.state.voting}/>
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
