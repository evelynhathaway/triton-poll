import React from "react";
import ReactDOM from "react-dom";
import {BrowserRouter as Router, Switch, Route} from "react-router-dom";

import Audience from "./components/Audience";
import Board from "./components/Board";
import Speaker from "./components/Speaker";
import Whoops404 from "./components/Whoops404";
import Header from "./components/parts/Header";
import {AppContext} from "./components/contexts/app-context";

const defaultState = {
    status: "disconnected",
    committee: undefined,
    roomCode: undefined,
    member: {},
    questions: [],
    currentQuestion: undefined,
}

export default class App extends React.Component {
    state = {
        ...defaultState,
    }

    joined(member) {
        sessionStorage.member = JSON.stringify(member);
        this.setState({
            member: member,
        });
    }

    connect() {
        const member = (sessionStorage.member) ? JSON.parse(sessionStorage.member) : null;

        //if(member) {
        //    if (member.type === "member") {
        //        this.socket.emit("join", member);
        //    } else if(member.type === "speaker") {
        //        this.socket.emit("start", member);
        //    }
        //}

        if (member && member.type === "audience") {
            this.socket.emit("join", member);
        } else if (member && member.type === "speaker") {
            this.socket.emit("start", {
                name: member.name,
                title: sessionStorage.title,
            });
        }

        this.setState({
            status: "connected",
        });
    }
    reconnect() {
        // TODO
    }
    disconnect() {
        this.setState({
            status: "disconnected",
        });
    }

    updateState(serverState) {
        // all our variables in state are covered...(title, audience, speaker now got values from server)
        this.setState(serverState);
    }

    leave() {
        // Reset member state
        this.setState({
            ...{
                member,
                roomCode,
                currentQuestion,
                committee,
            } = defaultState,
        });

        // Reset storage
        sessionStorage.member = defaultState.member;
        sessionStorage.roomCode = defaultState.roomCode;
    }

    render() {

        return (
            <div>
                <AppContext.Provider value={this}>
                    <Header/>
                    <Router>
                        <Switch>
                            <Route path="/" exact component={Audience}/>
                            <Route path="/speaker/" component={Speaker}/>
                            <Route path="/board/" component={Board}/>
                            <Route component={Whoops404}/>
                        </Switch>
                    </Router>
                </AppContext.Provider>
            </div>
        );
    }
};


// Now that we have routes configured, lets render components...
ReactDOM.render(
    <App/>,
    document.getElementById("react-container"),
);
