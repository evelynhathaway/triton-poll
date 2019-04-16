import React from "react";


export default class JoinSpeaker extends React.Component {
    committeeRef = React.createRef()
    roomCodeRef = React.createRef()

    createRoom() {
        const committeeEle = this.committeeRef.current;
        const roomCodeEle = this.roomCodeRef.current;

        const committee = committeeEle.value;
        const roomCode = roomCodeEle.value.toUpperCase();

        this.props.emit("create room", {committee, roomCode});
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
