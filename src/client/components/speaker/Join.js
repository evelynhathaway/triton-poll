import React from "react";
import {AppContext} from "../../contexts";


export default class JoinSpeaker extends React.Component {
    static contextType = AppContext

    state = {
        rooms: [],
    }

    committeeRef = React.createRef()
    roomCodeRef = React.createRef()

    componentDidMount() {
        this.listRooms();
    }

    // TODO: refresh list
    listRooms() {
        const {socket} = this.context;

        // List rooms and add to state
        socket.emit("list rooms", this.setState.bind(this));
    }

    createRoom() {
        const {socket} = this.context;

        const committeeEle = this.committeeRef.current;
        const roomCodeEle = this.roomCodeRef.current;

        const committee = committeeEle.value;
        const roomCode = roomCodeEle.value;

        // Create room on server, then join
        socket.emit("create room", {committee, roomCode, join: true}, error => alert(error));
    }

    render() {
        const {rooms} = this.state;

        return (
            <div>
                <h2>Join a room</h2>
                <div className="table-responsive">
                    <table className="table table-striped">
                        <thead>
                            <tr>
                                <th>Committee</th>
                                <th>Room Code</th>
                                <th>Join</th>
                            </tr>
                        </thead>
                        <tbody>
                            {rooms.map((room, index) => (
                                <tr key={index}>
                                    <td>{room.committee}</td>
                                    <td>{room.roomCode}</td>
                                    <td>
                                        <button className="btn btn-outline-dark" onClick={() => this.context.join.call(this.context, room)}>Join</button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                <hr className="my-3"></hr>

                <h2>Create a room</h2>
                <form action="javascript:void(0)" onSubmit={this.createRoom.bind(this)}>
                    <label htmlFor="committee-input">Committee</label>
                    <p>This will be shown to students as the page title.</p>
                    <input
                        ref={this.committeeRef}
                        className="form-control"
                        id="committee-input"
                        placeholder="Committee"
                        required
                    />

                    <label htmlFor="room-input">Room code</label>
                    <p>Used for joining as student. Optional, defaults to a random set of four letters to prevent unauthorized access. Case-insensitive.</p>
                    <input
                        ref={this.roomCodeRef}
                        className="form-control"
                        id="room-input"
                        placeholder="Room code"
                    />

                    <button className="btn btn-primary">Create room</button>
                </form>
            </div>
        );
    }
};
