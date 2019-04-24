import React from "react";
import {AppContext} from "../contexts";


export default class Footer extends React.Component {
    static contextType = AppContext

    render() {
        const {leave} = this.props;
        const {roomCode} = this.props.state;

        return (
            <footer id="header-text">
                {/* Conference name, session */}
                <div>
                    <p>Triton MUN - Session XIX</p>
                </div>

                {/* Leave room */}
                <div>
                    {roomCode && leave && <button className="btn btn-outline-dark" onClick={leave}>Leave room</button>}
                </div>
            </footer>
        );
    }
};
