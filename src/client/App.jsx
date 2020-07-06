import React from "react";
import ReactDOM from "react-dom";
import {BrowserRouter as Router, Switch, Route} from "react-router-dom";
import io from "socket.io-client";

import AlertBanner from "./components/AlertBanner";
import Footer from "./components/Footer";
import Header from "./components/Header";
import {AppContext} from "./contexts";
import Audience from "./routes/Audience";
import Speaker from "./routes/Speaker";
import Whoops404 from "./routes/Whoops404";


export default class App extends React.Component {
	constructor () {
		super(...arguments);

		this.setState = this.setState.bind(this);
		this.setUuid = this.setUuid.bind(this);
		this.connect = this.connect.bind(this);
		this.disconnect = this.disconnect.bind(this);
		this.connected = this.connected.bind(this);
		this.disconnected = this.disconnected.bind(this);
		this.join = this.join.bind(this);
		this.leave = this.leave.bind(this);
	}

	state = {
		audience: [],
		speakers: [],
		voting: false,
		status: "disconnected",
		member: {
			placard: {
				raised: false,
			},
		},
	}

	connect (namespace) {
		const socketAddress = (process.env.NODE_ENV === "development" ? ":8080" : "");
		const socketPath = `${socketAddress}/${namespace}`;

		// Create socket from `io`
		this.socket = io(socketPath);

		// Handlers
		this.socket.on("uuid", this.setUuid);
		this.socket.on("connect", this.connected);
		this.socket.on("disconnect", this.disconnected);
		this.socket.on("set state", this.setState);
	}
	disconnect () {
		this.socket.disconnect();
		this.socket = undefined;
	}

	setUuid (uuid) {
		document.cookie = `uuid=${uuid}`;
	}

	connected () {
		this.setState({
			status: "connected",
		});
	}
	disconnected () {
		this.setState({
			status: "disconnected",
		});
	}

	join (member) {
		// Ask server to join using the member object
		this.socket.emit("join", member, error => alert(error));
	}
	leave () {
		// Ask server to leave using the member object
		this.socket.emit("leave", this.state.member);
	}

	render () {
		return (
			<AppContext.Provider value={this}>
				<div id="content">
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
				</div>

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
