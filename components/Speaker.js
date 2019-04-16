import React from "react";
import Display from "./parts/Display";
import JoinSpeaker from "./parts/JoinSpeaker";
import Attendance from "./parts/Attendance";
import Questions from "./parts/Questions";
import {AppContext} from "../app-context";

export default class Speaker extends React.Component {
    static contextType = AppContext

    render() {
        const {status, member, audience, questions} = this.context.state;

        return (
            <div>
                <Display if={status === "connected"}>
                    <Display if={member.name && member.type === "speaker"}>
                        <Questions questions={questions}/>
                        <Attendance audience={audience}/>
                    </Display>

                    <Display if={!member.name}>
                        <h2>Create a room</h2>
                        <JoinSpeaker/>
                    </Display>
                </Display>
            </div>
        );
    }
};
