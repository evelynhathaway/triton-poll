import React from "react";
import {AppContext} from "../../contexts";


export default class Voting extends React.Component {
    static contextType = AppContext

    constructor() {
        super(...arguments);

        this.startVoting = this.startVoting.bind(this);
        this.endVoting = this.endVoting.bind(this);
    }

    startVoting() {
        const {socket} = this.context;
        const {member} = this.context.state;

        socket.emit("start voting", member);
    }
    endVoting() {
        const {socket} = this.context;
        const {member} = this.context.state;

        socket.emit("end voting", member);
    }

    makePercent(amount, total, places = 2) {
        const multiplier = 10**places;
        const percent = Math.round(amount / total * 100 * multiplier) / multiplier;
        return percent ? percent + "%" : "N/A";
    }

    makeResults() {
        const {audience} = this.context.state;

        return audience.reduce(
            (results, member) => {
                if (member.vote) {
                    results[member.vote]++;
                    results.total++;
                }
                return results;
            },
            {
                yes: 0,
                no: 0,
                abstain: 0,
                total: 0,
            },
        );
    }

    render() {
        const {voting} = this.context.state;
        const {yes, no, abstain, total} = this.makeResults();

        return (
            <div id="voting">
                <h2 className="my-3">Voting</h2>

                <button
                    className={"btn btn-primary" + (voting ? "disabled": "")}
                    onClick={this.startVoting}
                    disabled={voting ? "disabled" : ""}
                >
                    Start
                </button>
                <button
                    className={"btn btn-primary" + (voting ? "" : "disabled")}
                    onClick={this.endVoting}
                    disabled={voting ? "" : "disabled"}
                >
                    Clear and End
                </button>

                <div className="table-responsive mt-3">
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
                                <td>{yes}</td>
                                <td>{no}</td>
                                <td>{abstain}</td>
                                <td>{total}</td>
                            </tr>
                            <tr>
                                <td>{this.makePercent(yes, total)}</td>
                                <td>{this.makePercent(no, total)}</td>
                                <td>{this.makePercent(abstain, total)}</td>
                                <td>100%</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        );
    }
};
