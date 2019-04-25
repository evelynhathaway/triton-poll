import React from "react";
import ReactDOM from "react-dom";
import {BrowserRouter as Router, Switch, Route} from "react-router-dom";

import Header from "./components/Header";
import AlertBanner from "./components/AlertBanner";
import Footer from "./components/Footer";
import Audience from "./routes/Audience";
import Speaker from "./routes/Speaker";
import Whoops404 from "./routes/Whoops404";
import {AppContext} from "./contexts";


export default class App extends React.Component {
    // TODO: use socket context for moving around socket?

    state = {
        status: "disconnected",
        member: sessionStorage.member ? JSON.parse(sessionStorage.member) : {},
    }

    updateState(state) {
        // Store room, country name, etc. if set
        if (typeof state.member !== "undefined") {
            sessionStorage.member = JSON.stringify(state.member);
        }

        // Forward to React
        this.setState(state);
    }

    connect() {
        const {member} = this.state;

        this.setState({
            status: "connected",
        });

        if (member?.roomCode) {
            this.join(member);
        }
    }
    disconnect() {
        this.setState({
            status: "disconnected",
        });
    }

    join(member) {
        // Ask server to join using the member object
        this.socket.emit("join", member, error => alert(error));
    }
    leave() {
        // Ask server to leave using the member object
        this.socket.emit("leave", this.state.member);
    }

    render() {
        return (
            <AppContext.Provider value={this}>
                {/* Header */}
                <Header/>

                {/* Disconnection alert banner */}
                <AlertBanner/>

                {/* Browser history client-side router */}
                <Router>
                    <Switch>
                        {/* Audience page */}
                        <Route path="/" exact component={Audience}/>
                        {/* Speaker page */}
                        <Route path="/speaker/" component={Speaker}/>
                        {/* If no match, render the `route not found` page (doesn't explictly return HTTP 404) */}
                        <Route component={Whoops404}/>
                    </Switch>
                </Router>

                {/* Footer */}
                <Footer/>
            </AppContext.Provider>
        );
    }
}


// Render App component in the HTML container
ReactDOM.render(
    <App/>,
    document.getElementById("react-container"),
);