import React from "react";
import {AppContext} from "../../contexts";
import Placard from "./Placard";


export default class Placards extends React.Component {
    static contextType = AppContext

    clearAll() {
        // TODO lower every rendered card (as appossed to sending clearAll to the server)
    }

    render() {
        const placards = [{countryName: "TEST Country", date: Date.now()}];

        return (
            <div id="placards">
                <h2 className="my-3">Placards</h2>
                <p>Rasied placards, click one to lower or clear all.</p>
                <button
                    className={"btn btn-primary" + (placards.length ? "" : "disabled")}
                    onClick={this.clearAll.bind(this)}
                    disabled={placards.length ? "" : "disabled"}
                >
                    Clear all
                </button>
                <div className="placards my-3">
                    {/* For each placard that is up */}
                    {placards.map((placard, index) => <Placard key={index} placard={placard}/>)}
                </div>
            </div>
        );
    }
};
