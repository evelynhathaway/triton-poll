const React = require('react');
const Display = require('./parts/Display');

export default class Board extends React.Component {
    barGraphData(results){
        return Object.keys(results).map(function (choice) {
            return {
                label: choice,
                value: results[choice]
            };
        });
    }

    render(){
        return (
           <div id="scoreboard">
               <Display if={this.props.status === 'connected' && this.props.currentQuestion}>
                 <h3>{this.props.currentQuestion.q}</h3>
                   <h6>{JSON.stringify(this.props.results)}</h6>
               </Display>


               <Display if={this.props.status === 'connected' && !this.props.currentQuestion}>
                   <h3>Awaiting a question...</h3>
               </Display>

           </div>
        );
    }
};
