import React from "react";
import PropTypes from "prop-types";

import {AppContext} from "../../contexts";


export default class Placard extends React.Component {
	static contextType = AppContext

	static propTypes = {
		member: PropTypes.object.isRequired,
	}

	lowerPlacard() {
		const {socket} = this.context;
		const {member} = this.props;

		socket.emit("lower placard", [member]);
	}

	render() {
		const {countryName} = this.props.member;

		return (
			<div className="card text-center my-3 placard" onClick={this.lowerPlacard.bind(this)}>
				<div className="card-body">
					<h5>{countryName}</h5>
					<span>Raised, tap to lower</span>
				</div>
			</div>
		);
	}
}
