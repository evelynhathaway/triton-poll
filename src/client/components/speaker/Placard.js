import React from "react";
import TimeAgo from "react-timeago";
import {AppContext} from "../../contexts";


export default class Placard extends React.Component {
    static contextType = AppContext

    lowerPlacard() {
        const {socket} = this.context;
        const {member} = this.props;

        socket.emit("lower placard", [member]);
    }

    render() {
        const {countryName, placard} = this.props.member;
        const {timeRaised} = placard;

        return (
            <div className="card text-center my-3 placard" onClick={this.lowerPlacard.bind(this)}>
                <div className="card-body">
                    <h5>{countryName}</h5>
                    <span>Raised </span>
                    <TimeAgo minPeriod={3} date={timeRaised}/>
                    <span>, tap to lower</span>
                </div>
            </div>
        );
    }
};
