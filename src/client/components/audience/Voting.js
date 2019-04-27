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
                <h2>Voting</h2>
                {
                    vote && (
                        <p>You voted {vote}</p>
                    ) || (
                        <>
                            <button
                                className={"btn btn-primary" + (voting ? "" : " disabled")}
                                onClick={this.vote.bind(this, "yes")}
                                disabled={voting ? "" : "disabled"}
                            >
                                Yes
                            </button>
                            <button
                                className={"btn btn-primary" + (voting ? "" : " disabled")}
                                onClick={this.vote.bind(this, "no")}
                                disabled={voting ? "" : "disabled"}
                            >
                                No
                            </button>
                            <button
                                className={"btn btn-primary" + (voting ? "" : " disabled")}
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
};
