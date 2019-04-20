import React from "react";
import {SpeakerContext} from "../contexts/speaker-context";

export default class Attendance extends React.Component {
    static contextType = SpeakerContext

    addMemberRow(member, i) {
        return (
            <tr key={i}>
                <td>{member.countryName}</td>
            </tr>
        );
    }

    render() {
        const {audience} = this.context.state;

        return (
            <div>
                <h2>Attendance - {audience.length} member{audience.length === 1 ? "" : "s"}</h2>
                <div className="table-responsive">
                    <table className="table table-striped">
                        <thead>
                            <tr>
                                <th>Countries connected</th>
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
