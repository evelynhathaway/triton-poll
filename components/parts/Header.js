const PropTypes = require('prop-types');
const React = require('react');

export default class Header extends React.Component {
    propTypes = {
        title: PropTypes.string.isRequired
    }

    render(){
        return (
            <header className="row">
                <div className="col-xs-10">
                    <h1>{this.props.title}</h1>
                    <p>{this.props.speaker}</p>
                </div>
                <div className="col-xs-2">
                    <span id="connection-status" className={this.props.status}></span>
                </div>
            </header>
        );
    }
};
