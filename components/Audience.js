import React from "react";
import Display from "./parts/Display";
import Join from "./parts/Join";
import Ask from "./parts/Ask";

export default class Audience extends React.Component {
    render() {
        return (
            <div>
                <Display if={this.props.status === "connected"}>
                    <Display if={this.props.member.countryName}>
                        <Display if={!this.props.currentQuestion}>
                            <h3>Welcome, {this.props.member.countryName}</h3>
                            <p>{this.props.audience.length} audience members connected</p>
                        </Display>
                        <Display if={this.props.currentQuestion}>
                            <Ask emit={this.props.emit} question={this.props.currentQuestion}/>
                        </Display>
                    </Display>

                    <Display if={!this.props.member.countryName}>
                        <h2>Join a room</h2>
                        <Join emit={this.props.emit}/>
                    </Display>
                </Display>
            </div>
        );
    }
};
