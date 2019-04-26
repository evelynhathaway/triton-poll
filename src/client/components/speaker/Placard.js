import React from "react";
import TimeAgo from "react-timeago";


export default class Placard extends React.Component {
    lowerPlacard() {
        const {socket} = this.context;
        const {member} = this.props;

        socket.emit("lower placard", member);
    }

    render() {
        const {countryName, placard} = this.props.member;
        const {timeRaised} = placard;

        return (
            // TODO cursor
            <div className="card text-center" onClick={this.lowerPlacard.bind(this)}>
                <div className="card-body">
                    <h5>{countryName}</h5>
                    <TimeAgo minPeriod={3} date={timeRaised} className="text-muted"/>
                </div>
            </div>
        );
    }
};
