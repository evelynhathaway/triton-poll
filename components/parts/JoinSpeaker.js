import React from "react";


export default class JoinSpeaker extends React.Component {
    constructor(props) {
        super(props);

        this.speakerNameEle = React.createRef();
        this.presentTitleEle = React.createRef();
    }

    start() {
        const {speakerNameEle, presentTitleEle} = this;

        const speakersName = speakerNameEle.value;
        const presentTitle = presentTitleEle.value;
        this.props.emit("start", {
            name: speakersName,
            title: presentTitle,
        });
    }

    render() {
        return (
            <form action="javascript:void(0)" onSubmit={this.start}>
                <label>Full Name</label>
                <input
                    ref={this.speakerNameEle}
                    className="form-control"
                    placeholder="enter your full name..."
                    required
                />

                <label>Presentation Title</label>
                <input
                    ref={this.presentTitleEle}
                    className="form-control"
                    placeholder="enter a title for this presentation..."
                    required
                />
                <button className="btn btn-primary">Join</button>
            </form>
        );
    }
};
