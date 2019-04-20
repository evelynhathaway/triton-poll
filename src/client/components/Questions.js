import React from "react";
import {SpeakerContext} from "../contexts/speaker-context";

export default class Questions extends React.Component {
    static contextType = SpeakerContext

    ask(question) {
        const {socket} = this.context;

        socket.emit("ask", question);
    }

    addQuestion(question, i) {
        return (
            <div key={i} className="col-xs-12 col-sm-6 sol-md-3">
                <span onClick={this.ask.bind(this, question)}>{question.q}</span>
            </div>
        );
    }

    render() {
        const {questions} = this.context.state;

        return (
            <div id="questions" className="row">
                <h2>Questions</h2>
                {/* {questions.map(this.addQuestion.bind(this))} */}
            </div>
        );
    }
};
