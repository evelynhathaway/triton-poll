import React from "react";
import TimeAgo from "react-timeago";


export default class Placard extends React.Component {
    lowerPlacard() {
        console.log("lowered");
    }

    render() {
        const {countryName, date} = this.props.placard;

        return (
            // TODO cursor
            <div className="card text-center" onClick={this.lowerPlacard.bind(this)}>
                <div className="card-body">
                    <h5>{countryName}</h5>
                    <TimeAgo minPeriod={3} date={date} className="text-muted"/>
                </div>
            </div>
        );
    }
};
