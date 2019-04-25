import React from "react";
import {SpeakerContext} from "../../contexts";


export default class Attendance extends React.Component {
    static contextType = SpeakerContext

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

        return (
            <div>
                <h2 className="my-3">Attendance</h2>
                {/* TODO: how many connected/disconnected? */}
                <p>There are {audience.length} member{audience.length === 1 ? " is" : "s are"} in this session.</p>
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
