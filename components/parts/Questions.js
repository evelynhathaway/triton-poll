import React from "react";
import {AppContext} from "../../app-context";

export default class Questions extends React.Component {
    static contextType = AppContext

    ask(question) {
        const {emit} = this.context.globalMethods;

        emit("ask", question);
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
                {questions.map(this.addQuestion.bind(this))}
            </div>
        );
    }
};
