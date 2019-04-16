import React from "react";
import Display from "./parts/Display";
import {AppContext} from "../app-context";

export default class Board extends React.Component {
    static contextType = AppContext

    barGraphData(results){
        return Object.keys(results).map((choice) => {
            return {
                label: choice,
                value: results[choice],
            };
        });
    }

    render(){
        const {status, currentQuestion, results} = this.context.state;

        return (
            <div id="scoreboard">
                <Display if={status === "connected" && currentQuestion}>
                    <h3>{currentQuestion.q}</h3>
                    <h6>{JSON.stringify(results)}</h6>
                </Display>


                <Display if={status === "connected" && !currentQuestion}>
                    <h3>Awaiting a question...</h3>
                </Display>
            </div>
        );
    }
};
