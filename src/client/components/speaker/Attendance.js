import React from "react";
import {AppContext} from "../../contexts";


export default class Attendance extends React.Component {
    static contextType = AppContext

    addMemberRow(member, index) {
        return (
            <tr key={index}>
                <td>{member.countryName}</td>
                <td>{member.status}</td>
                <td>{member.vote}</td>
            </tr>
        );
    }

    render() {
        const {audience} = this.context.state;
        const disconnected = audience.filter(member => member.status === "disconnected").length;

        return (
            <div>
                <h2 className="my-3">Attendance</h2>
                <p>There {audience.length === 1 ? "is" : "are"} {audience.length} member{audience.length === 1 ? "" : "s"} in this session{disconnected ? `, and ${disconnected} of them ${disconnected === 1 ? "is" : "are"} disconnected` : ""}.</p>
                <div className="table-responsive">
                    <table className="table table-striped">
                        <thead>
                            <tr>
                                <th>Country name</th>
                                <th>Status</th>
                                <th>Vote</th>
                            </tr>
                        </thead>
                        <tbody>
                            {audience.map(this.addMemberRow)}
                        </tbody>
                    </table>
                </div>
            </div>
        );
    }
};
