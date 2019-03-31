import React from "react";

export default class Attendance extends React.Component {
    addMemberRow(member, i) {
        return (
            <tr key={i}>
                <td>{member.name}</td>
                <td>{member.id}</td>
            </tr>
        );
    }

    render() {
        return (
            <div>
                <h2>Attendance - {this.props.audience.length} members</h2>
                <table className="table table-striped">
                    <thead>
                        <tr>
                            <th>Audience members</th>
                            <th>Socket ID</th>
                        </tr>
                    </thead>
                    <tbody>
                        {this.props.audience.map(this.addMemberRow)}
                    </tbody>
                </table>
            </div>
        );
    }
};
