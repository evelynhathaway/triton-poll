const React = require('react');

export default class Display extends React.Component {
    render(){
        return (this.props.if) ? <div>{this.props.children}</div> : null;
    }
};
