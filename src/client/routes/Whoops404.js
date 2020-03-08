import React from "react";
import {Link} from "react-router-dom";


export default class Whoops404 extends React.Component {
	render() {
		return (
			<div id="not-found">
				<h1>Whoops...</h1>
				<p>We cannot find the page that you requested. Were you lookin one of te following?</p>
				<Link to="/">Join as Audience</Link>
				<br/>
				<Link to="/speaker">Join as Speaker</Link>
			</div>
		);
	}
}
