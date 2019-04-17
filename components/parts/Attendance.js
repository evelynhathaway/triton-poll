import React from "react";
import {AppContext} from "../contexts/app-context";

export default class Attendance extends React.Component {
    static contextType = AppContext

    addMemberRow(member, i) {
        return (
            <tr key={i}>
                <td>{member.name}</td>
                <td>{member.id}</td>
            </tr>
        );
    }

    render() {
        const {audience} = this.context.state;

        return (
            <div>
                <h2>Attendance - {audience.length} members</h2>
                <table className="table table-striped">
                    <thead>
                        <tr>
                            <th>Audience members</th>
                            <th>Socket ID</th>
                        </tr>
                    </thead>
                    <tbody>
                        {audience.map(this.addMemberRow)}
                    </tbody>
                </table>
            </div>
        );
    }
};
