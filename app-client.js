import React from "react";
import ReactDOM from "react-dom";
import {BrowserRouter as Router, Switch, Route} from "react-router-dom";
import io from "socket.io-client";

import Audience from "./components/Audience";
import Board from "./components/Board";
import Speaker from "./components/Speaker";
import Whoops404 from "./components/Whoops404";
import Header from "./components/parts/Header";


export default class App extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            status: "disconnected",
            title: "",
            member: {},
            audience: [],
            speaker: "",
            questions: [],
            currentQuestion: false,
            results: {},
        };
    };

    componentWillMount() {
        this.socket = io("http://localhost:3000"); // TODO: change on `env`: prod|dev
        this.socket.on("connect", this.connect.bind(this));
        this.socket.on("disconnect", this.disconnect.bind(this));
        this.socket.on("welcome", this.updateState.bind(this));
        this.socket.on("joined", this.joined.bind(this));
        this.socket.on("audience", this.updateAudience.bind(this));
        this.socket.on("start", this.start.bind(this));
        this.socket.on("end", this.updateState.bind(this));
        this.socket.on("ask", this.ask.bind(this));
        this.socket.on("results", this.updateResults.bind(this));
    }

    joined(member) {
        sessionStorage.member = JSON.stringify(member);
        this.setState({
            member: member,
        });
    }

    emit(eventName, payload) {
        this.socket.emit(eventName, payload);
    }

    connect() {
        const member = (sessionStorage.member) ? JSON.parse(sessionStorage.member) : null;

        //if(member) {
        //    if (member.type === "member") {
        //        this.emit("join", member);
        //    } else if(member.type === "speaker") {
        //        this.emit("start", member);
        //    }
        //}

        if (member && member.type === "audience") {
            this.emit("join", member);
        } else if (member && member.type === "speaker") {
            this.emit("start", {
                name: member.name,
                title: sessionStorage.title,
            });
        }

        this.setState({
            status: "connected",
        });
    }
    disconnect() {
        console.log("Disconnected");
        this.setState({
            status: "disconnected",
            title: "disconnected",
            speaker: "",
        });
    }

    updateState(serverState) {
        // all our variables in state are covered...(title, audience, speaker now got values from server)
        this.setState(serverState);
    }

    updateAudience(audienceArray) {
        this.setState({
            audience: audienceArray
        });
    }

    start(presentation) {
        if (this.state.member.type === "speaker") {
            sessionStorage.title = presentation.title;
        }
        this.setState(presentation);
    }

    ask(question) {
        sessionStorage.answer = "";
        this.setState({
            currentQuestion: question,
            results : {a:0, b:0, c:0, d:0},
        });
    }

    updateResults(data) {
        this.setState({
            results: data,
        });
    }

    render() {
        // Create bound copy of `this.emit` for child elements
        const boundEmit = this.emit.bind(this);

        return (
            <div>
                <Header {...this.state}/>
                <Router>
                    <Switch>
                        <Route path="/" exact component={props => <Audience emit={boundEmit} {...this.state} {...props}/>}/>
                        <Route path="/speaker/" component={props => <Speaker emit={boundEmit} {...this.state} {...props}/>}/>
                        <Route path="/board/" component={props => <Board emit={boundEmit} {...this.state} {...props}/>}/>
                        <Route component={props => <Whoops404 emit={boundEmit} {...this.state} {...props}/>}/>
                    </Switch>
                </Router>
            </div>
        );
    }
};


// Now that we have routes configured, lets render components...
ReactDOM.render(
    <App/>,
    document.getElementById("react-container"),
);
