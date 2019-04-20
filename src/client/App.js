import React from "react";
import ReactDOM from "react-dom";
import {BrowserRouter as Router, Switch, Route} from "react-router-dom";

import Audience from "./routes/Audience";
import Board from "./routes/Board";
import Speaker from "./routes/Speaker";
import Whoops404 from "./routes/Whoops404";
import {AppContext} from "./contexts/app-context";


export default class App extends React.Component {
    render() {
        return (
            <AppContext.Provider value={this}>
                <Router>
                    <Switch>
                        <Route path="/" exact component={Audience}/>
                        <Route path="/speaker/" component={Speaker}/>
                        <Route path="/board/" component={Board}/>
                        <Route component={Whoops404}/>
                    </Switch>
                </Router>
            </AppContext.Provider>
        );
    }
};


// Render App component in the HTML container
ReactDOM.render(
    <App/>,
    document.getElementById("react-container"),
);
