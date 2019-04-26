import React from "react";
import {AppContext} from "../../contexts";
import Placard from "./Placard";


export default class Placards extends React.Component {
    static contextType = AppContext

    // Lower every currently rendered card (as appossed to sending clearAll to the server)
    clearAll(member) {
        const {socket} = this.context;

        socket.emit("lower placard", member);
    }

    render() {
        const {audience} = this.context.state;
        const raisedMembers = (audience
            .filter(member => member.placard?.raised)
            .sort((a, b) => a.placard.timeRaised - b.placard.timeRaised)
        );

        return (
            <div id="placards">
                <h2 className="my-3">Placards</h2>
                <p>Raised placards, click one to lower or clear all.</p>
                <button
                    className={"btn btn-primary" + (raisedMembers.length ? "" : "disabled")}
                    onClick={this.clearAll.bind(this, raisedMembers)}
                    disabled={raisedMembers.length ? "" : "disabled"}
                >
                    Clear all
                </button>
                <div className="placards my-3">
                    {/* For each placard that is up */}
                    {raisedMembers.map((member, index) => <Placard key={index} member={member}/>)}
                </div>
            </div>
        );
    }
};
