import React from "react";

import Join from "../components/speaker/Join";
import Voting from "../components/speaker/Voting";
import Placards from "../components/speaker/Placards";
import Attendance from "../components/speaker/Attendance";
import {AppContext} from "../contexts";


export default class Speaker extends React.Component {
    static contextType = AppContext

    componentDidMount() {
        this.context.connect("speaker");
    }
    componentWillUnmount() {
        this.context.disconnect();
    }

    render() {
        const {status, member} = this.context.state;
        const {roomCode} = member;

        return (
            <div>
                {
                    status === "connected" &&
                    (
                        roomCode && (
                            <>
                                {/* Voting actions and summary */}
                                <Voting member={member}/>
                                {/* Placards raised */}
                                <Placards/>
                                {/* Attendance and voting breakdown */}
                                <Attendance/>
                            </>
                        ) || (
                            <Join join={this.context.join}/>
                        )
                    )
                }
            </div>
        );
    }
}
