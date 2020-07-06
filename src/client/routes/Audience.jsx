import React from "react";

import Join from "../components/audience/Join";
import Placard from "../components/audience/Placard";
import Voting from "../components/audience/Voting";
import {AppContext} from "../contexts";


export default class Audience extends React.Component {
	static contextType = AppContext

	componentDidMount () {
		this.context.connect("audience");
	}
	componentWillUnmount () {
		this.context.disconnect();
	}

	render () {
		const {status, member} = this.context.state;
		const {countryName, roomCode} = member;

		return (
			<div>
				{
					status === "connected" && (
						roomCode && countryName && (
							<>
								<Placard/>
								<Voting/>
							</>
						) || (
							<Join/>
						)
					)
				}
			</div>
		);
	}
}
