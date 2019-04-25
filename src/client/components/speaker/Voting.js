import React from "react";
import {SpeakerContext} from "../../contexts";


export default class Voting extends React.Component {
    static contextType = SpeakerContext

    state = {
        voting: false,
        votes: {
            get total() {
                return Object.keys(this).reduce((accumulator, key) => key !== "total" && accumulator + (this[key].amount || 0), 0);
            },
            yes: 0,
            no: 0,
            abstain: 0,
        },
    }

    startVoting() {
        const {socket} = this.context;

        socket.emit("start voting");
    }
    endVoting() {
        const {socket} = this.context;

        socket.emit("end voting");
    }

    render() {
        const {voting, votes} = this.state;

        return (
            <div id="voting">
                <h2>Voting</h2>

                <button
                    className={"btn btn-primary" + (voting ? "disabled": "")}
                    onClick={this.startVoting.bind(this)}
                    disabled={voting ? "disabled" : ""}
                >
                    Start
                </button>
                <button
                    className={"btn btn-primary" + (voting ? "" : "disabled")}
                    onClick={this.endVoting.bind(this)}
                    disabled={voting ? "" : "disabled"}
                >
                    Clear and End
                </button>

                <div className="table-responsive">
                    <table className="table">
                        <thead>
                            <tr>
                                <th>Yes</th>
                                <th>No</th>
                                <th>Abstain</th>
                                <th>Total</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td>{votes.yes}</td>
                                <td>{votes.no}</td>
                                <td>{votes.abstain}</td>
                                <td>{votes.total}</td>
                            </tr>
                            {/* TODO: percents */}
                            <tr>
                                <td>{votes.yes}</td>
                                <td>{votes.no}</td>
                                <td>{votes.abstain}</td>
                                <td>100%</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        );
    }
};
