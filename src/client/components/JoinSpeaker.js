import React from "react";
import {AppContext} from "../contexts/app-context";


export default class JoinSpeaker extends React.Component {
    static contextType = AppContext

    committeeRef = React.createRef()
    roomCodeRef = React.createRef()

    createRoom() {
        const {socket} = this.context;

        const committeeEle = this.committeeRef.current;
        const roomCodeEle = this.roomCodeRef.current;

        const committee = committeeEle.value;
        const roomCode = roomCodeEle.value;

        // Create room on server
        socket.emit(
            "create room",
            {committee, roomCode},
            // Handle response
            ({roomCode, error}) => {
                // Alert if error
                if (error) {
                    return alert(error);
                }

                // Otherwise join the new room
                // - Uses the server roomCode for normalization and fallback on random
                this.joinRoom(roomCode);
            },
        );
    }

    joinRoom(roomCode) {
        const {socket} = this.context;

        socket.join(roomCode);

        // TODO: populate state to global as speaker
    }

    render() {
        return (
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
        );
    }
};
