import React from "react";
import {AudienceContext} from "../../contexts";


export default class Placard extends React.Component {
    static contextType = AudienceContext

    raisePlacard() {

    }
    lowerPlacard() {

    }

    render() {
        const {countryName} = this.props.member;
        const {rasied, timeRaised} = this.props.placard;

        return (
            <div className="card text-center" onClick={this.lowerPlacard.bind(this)}>
                <div className="card-body">
                    <h5>{countryName}</h5>
                    {
                        rasied && (
                            <>
                                <span>Rasied </span>
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
