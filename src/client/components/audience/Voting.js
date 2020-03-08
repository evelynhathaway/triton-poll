import React from "react";
import {AppContext} from "../../contexts";


export default class Voting extends React.Component {
	static contextType = AppContext

	vote(position) {
		const {socket} = this.context;
		const {member} = this.context.state;

		socket.emit("vote", member, position);
	}

	render() {
		const {voting, member} = this.context.state;
		const {vote} = member;

		return (
			<div id="voting">
				<h2 className="my-3">Voting</h2>

				{
					vote && (
						<p>You voted {vote} on the last motion.</p>
					) || (
						<>
							<p>{voting ? "Press the button that matches your position on this motion." : "There isn't anything to vote on yet."}</p>

							<button
								className={"btn btn-primary btn-lg mr-3" + (voting ? "" : " disabled")}
								onClick={this.vote.bind(this, "yes")}
								disabled={voting ? "" : "disabled"}
							>
								Yes
							</button>
							<button
								className={"btn btn-primary btn-lg mx-3" + (voting ? "" : " disabled")}
								onClick={this.vote.bind(this, "no")}
								disabled={voting ? "" : "disabled"}
							>
								No
							</button>
							<button
								className={"btn btn-primary btn-lg ml-3" + (voting ? "" : " disabled")}
								onClick={this.vote.bind(this, "abstain")}
								disabled={voting ? "" : "disabled"}
							>
								Abstain
							</button>
						</>
					)
				}
			</div>
		);
	}
}
