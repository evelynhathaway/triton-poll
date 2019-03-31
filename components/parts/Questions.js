import React from "react";

export default class Questions extends React.Component {

    ask(question) {
        this.props.emit("ask", question);
    }

    addQuestion(question, i) {
        return (
            <div key={i} className="col-xs-12 col-sm-6 sol-md-3">
                <span onClick={this.ask.bind(null, question)}>{question.q}</span>
            </div>
        );


    }

    render() {

        return (
            <div id="questions" className="row">
                <h2>Questions</h2>
                {this.props.questions.map(this.addQuestion)}
            </div>
        );
    }
};
