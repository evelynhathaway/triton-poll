import React from "react";
import {AudienceContext} from "../../contexts";


export default class Join extends React.Component {
    static contextType = AudienceContext

    countryNameRef = React.createRef()
    roomCodeRef = React.createRef()

    submit() {
        const countryNameEle = this.countryNameRef.current;
        const roomCodeEle = this.roomCodeRef.current;

        const countryName = countryNameEle.value;
        const roomCode = roomCodeEle.value;

        this.context.join({countryName, roomCode});
    }

    render() {
        const {roomCode} = this.context.state;

        return (
            <div>
                <h2>Join a room</h2>

                <form action="javascript:void(0)" onSubmit={this.submit.bind(this)}>
                    <label htmlFor="countryname-input">Country name</label>
                    <p>Enter it as it appears on your placard.</p>
                    <input
                        ref={this.countryNameRef}
                        className="form-control"
                        placeholder="Kingdom of Arendelle"
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
                        value={roomCode ? roomCode : ""}
                    />

                    <button className="btn btn-primary">Join</button>
                </form>
            </div>
        );
    }
};
