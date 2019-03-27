import React from "react";
import {Link} from "react-router-dom";

export default class Join extends React.Component {
    join(){
        const memberName = this.refs.name.value;
        this.props.emit('join', {
            name: memberName
        });
        this.refs.name.value = '';
    }

    render(){
        return (
            <form action="javascript:void(0)" onSubmit={this.join}>
                <label>Full Name</label>
                <input ref="name" className="form-control"
                       placeholder="enter your full name..."
                       required
                    />
                <button className="btn btn-primary">Join</button>
                <Link to="/speaker">Join as Speaker</Link>
                <Link to="/board">Results Board</Link>
            </form>
        );
    }
};
