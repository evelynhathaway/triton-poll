import React from "react";
import Display from "./util/Display";
import {AppContext} from "../contexts/app-context";

export default class Ask extends React.Component {
    static contextType = AppContext

    choices = []
    answer = undefined

    componentWillMount() {
        this.setUpChoices();
    }

    componentWillReceiveProps() {
        this.setUpChoices();
    }

    setUpChoices() {
        const choices = Object.keys(this.props.question);
        choices.shift();

        this.setState({
            choices: choices,
            answer: sessionStorage.answer,
        });
    }

    select(choice) {
        const {socket} = this.context;

        this.setState({
            answer: choice,
        });
        sessionStorage.answer = choice;

        socket.emit("answer", {
            question: this.props.question,
            choice: choice,
        });
    }

    addChoiceButton(choice, i) {
        const buttonTypes = ["primary", "success", "warning", "danger"];

        return (
            <button
                onClick={this.select.bind(this, choice)}
                className={"col-xs-12 col-sm-6 btn btn-" + buttonTypes[i]}
                key={i}
            >
                {choice}: {this.props.question[choice]}
            </button>
        );
    }

    render() {
        const {status, member, audience, questions} = this.context.state;

        return (
            <div id="currentQuestion">
                <Display if={this.state.answer}>
                    <h3>You answered: {this.state.answer} </h3>
                    <p>{this.props.question[this.state.answer]}</p>
                </Display>

                <Display if={!this.state.answer}>
                    <h2>{this.props.question.q}</h2>

                    <div className="row">
                        {this.state.choices.map(this.addChoiceButton.bind(this))}
                    </div>
                </Display>
            </div>
        );
    }
};
