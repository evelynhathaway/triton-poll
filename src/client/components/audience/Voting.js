import React from "react";
import {AppContext} from "../../contexts";


export default class Voting extends React.Component {
    static contextType = AppContext

    startVoting() {
    }
    vote(position) {
        const {socket} = this.context;

        socket.emit("vote", position);
    }

    render() {
        const {voting} = this.context.state;

        return (
            <div id="voting">
                <h2>Voting</h2>

                <button
                    className={"btn btn-primary" + (voting ? "" : "disabled")}
                    onClick={this.vote.bind(this, "yes")}
                    disabled={voting ? "" : "disabled"}
                >
                    Yes
                </button>
                <button
                    className={"btn btn-primary" + (voting ? "" : "disabled")}
                    onClick={this.vote.bind(this, "no")}
                    disabled={voting ? "" : "disabled"}
                >
                    No
                </button>
                <button
                    className={"btn btn-primary" + (voting ? "" : "disabled")}
                    onClick={this.vote.bind(this, "abstain")}
                    disabled={voting ? "" : "disabled"}
                >
                    Abstain
                </button>
            </div>
        );
    }
};
