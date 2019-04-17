import React from "react";
import {AppContext} from "../contexts/app-context";

export default class Join extends React.Component {
    static contextType = AppContext

    countryNameRef = React.createRef()
    roomCodeRef = React.createRef()

    join() {
        const {socket} = this.context;

        const countryNameEle = this.countryNameRef.current;
        const roomCodeEle = this.roomCodeRef.current;

        const countryName = countryNameEle.value;
        const roomCode = roomCodeEle.value.toUpperCase();

        socket.emit("join", {countryName, roomCode});
    }

    render() {
        return (
            <form action="javascript:void(0)" onSubmit={this.join.bind(this)}>
                <label htmlFor="countryname-input">Country name</label>
                <p>Enter it as it appears on your placard.</p>
                <input
                    ref={this.countryNameRef}
                    className="form-control"
                    placeholder="United States of America"
                    id="countryname-input"
                    required
                />

                <label htmlFor="room-input">Room code</label>
                <p>This should be written at the front of the room or otherwise provided by a chair.</p>
                <input
                    ref={this.roomCodeRef}
                    className="form-control"
                    id="room-input"
                    placeholder="Room code"
                    required
                />

                <button className="btn btn-primary">Join</button>
            </form>
        );
    }
};
