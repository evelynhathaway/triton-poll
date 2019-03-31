import PropTypes from "prop-types";
import React from "react";

export default class Header extends React.Component {
    render() {
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

    static propTypes = {
        title: PropTypes.string.isRequired
    }
};
