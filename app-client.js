import React from "react";

import {BrowserRouter as Router, Route} from "react-router-dom";

import APP from "./components/APP";
import Audience from "./components/Audience";
import Board from "./components/Board";
import Speaker from "./components/Speaker";
import Whoops404 from "./components/Whoops404";
import ReactDOM from "react-dom";

// Main component that will include and render all other componennts is APP!
const routes = (
    <Router component={APP}>
        <div>
            <Route path="/" component={Audience}/>
            <Route name="speaker" path="/speaker/" component={Speaker}/>
            <Route name="board" path="/board/" component={Board}/>
            {/* <Route path="*" component={Whoops404}/> */}
        </div>
    </Router>
);

// Now that we have routes configured, lets render components...
ReactDOM.render(
    routes,
    document.getElementById("react-container")
);
