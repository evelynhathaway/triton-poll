import React from "react";
import Display from "./parts/Display";
import Join from "./parts/Join";
import Ask from "./parts/Ask";
import {AppContext} from "../app-context";

export default class Audience extends React.Component {
    static contextType = AppContext

    render() {
        const {status, member, audience, currentQuestion} = this.context.state;

        return (
            <div>
                <Display if={status === "connected"}>
                    <Display if={member.countryName}>
                        <Display if={!currentQuestion}>
                            <h3>Welcome, {member.countryName}</h3>
                            <p>{audience.length} audience members connected</p>
                        </Display>
                        <Display if={currentQuestion}>
                            <Ask question={currentQuestion}/>
                        </Display>
                    </Display>

                    <Display if={!member.countryName}>
                        <h2>Join a room</h2>
                        <Join/>
                    </Display>
                </Display>
            </div>
        );
    }
};
