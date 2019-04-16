import React from "react";
import Display from "./parts/Display";
import JoinSpeaker from "./parts/JoinSpeaker";
import Attendance from "./parts/Attendance";
import Questions from "./parts/Questions";

export default class Speaker extends React.Component {
    render() {
        return (
            <div>
                <Display if={this.props.status === "connected"}>
                    <Display if={this.props.member.name && this.props.member.type === "speaker"}>
                        <Questions emit={this.props.emit} questions={this.props.questions}/>
                        <Attendance audience={this.props.audience}/>
                    </Display>

                    <Display if={!this.props.member.name}>
                        <h2>Create a room</h2>
                        <JoinSpeaker emit={this.props.emit}/>
                    </Display>
                </Display>
            </div>
        );
    }
};
