import React from "react";
import TimeAgo from "react-timeago";
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
        const {raised, timeRaised} = placard || {}; // TODO: make always be in state

        return (
            <div className="card text-center" onClick={raised ? this.lowerPlacard : this.raisePlacard}>
                <div className="card-body">
                    <h5>{countryName}</h5>
                    {
                        raised && (
                            <>
                                <span>Raised </span>
                                <TimeAgo minPeriod={3} date={timeRaised} className="text-muted"/>
                            </>
                        ) || (
                            <span>Lowered, tap to raise</span>
                        )
                    }
                </div>
            </div>
        );
    }
};
