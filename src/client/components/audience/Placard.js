import React from "react";
import {AppContext} from "../../contexts";


export default class Placard extends React.Component {
    constructor() {
        super(...arguments);

        this.lowerPlacard = this.lowerPlacard.bind(this);
        this.raisePlacard = this.raisePlacard.bind(this);
    }

    static contextType = AppContext

    raisePlacard() {
        const {socket} = this.context;
        const {member} = this.context.state;

        socket.emit("raise placard", member);
    }
    lowerPlacard() {
        const {socket} = this.context;
        const {member} = this.context.state;

        socket.emit("lower placard", member);
    }

    render() {
        const {member} = this.context.state;
        const {countryName, placard} = member;
        const {raised} = placard;

        return (
            <div id="placard">
                <h2 className="my-3">Placard</h2>
                <p>Tap to raise your placard to get the attention of a chair, make motions, or to be added to the speaker's list.</p>

                <div
                    className={"card text-center my-3 placard" + (raised ? " raised" : "")}
                    onClick={raised ? this.lowerPlacard : this.raisePlacard}
                >
                    <div className="card-body">
                        <h5>{countryName}</h5>
                        {
                            raised && (
                                <span>Raised, tap to lower</span>
                            ) || (
                                <span>Lowered, tap to raise</span>
                            )
                        }
                    </div>
                </div>
            </div>
        );
    }
}
