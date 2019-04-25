import React from "react";
import {AppContext} from "../../contexts";


export default class Voting extends React.Component {
    static contextType = AppContext

    startVoting() {
        const {socket} = this.context;
        const {member} = this.context;

        socket.emit("start voting", member);
    }
    endVoting() {
        const {socket} = this.context;
        const {member} = this.context;

        socket.emit("end voting", member);
    }

    makePercent(amount, total, places = 2) {
        const multiplier = 10**places;
        const percent = Math.round(amount / total * 100 * multiplier) / multiplier;
        return percent ? percent + "%" : "N/A";
    }

    render() {
        const {voting, votes} = this.context.state;
        const {yes, no, abstain} = votes;
        const total = yes + no + abstain;

        return (
            <div id="voting">
                <h2 className="my-3">Voting</h2>

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
                            {/* TODO: percents */}
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
