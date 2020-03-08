import React from "react";
import {AppContext} from "../contexts";


export default class Footer extends React.Component {
	static contextType = AppContext

	render() {
		const {roomCode} = this.context.state.member;
		const leave = this.context.leave.bind(this.context);

		return (
			<footer id="footer">
				{/* Leave room */}
				{roomCode && <button className="btn btn-outline-dark" onClick={leave}>Leave room</button>}
			</footer>
		);
	}
}
