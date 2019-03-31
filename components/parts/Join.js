import React from "react";
import {Link} from "react-router-dom";

export default class Join extends React.Component {
    constructor(props) {
        super(props);

        this.memberNameEle = React.createRef();
    }

    join() {
        const {memberNameEle} = this;
        const memberName = memberNameEle.value;

        this.props.emit("join", {
            name: memberName,
        });

        memberNameEle.value = "";
    }

    render() {
        return (
            <form action="javascript:void(0)" onSubmit={this.join}>
                <label>Full Name</label>
                <input
                    ref={this.memberNameEle}
                    className="form-control"
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
