import React from "react";


export default class JoinSpeaker extends React.Component {
    constructor(props) {
        super(props);

        this.speakerNameRef = React.createRef();
        this.presentTitleRef = React.createRef();
    }

    start() {
        const speakerNameEle = this.speakerNameRef.current;
        const presentTitleEle = this.presentTitleRef.current;

        const speakersName = speakerNameEle.value;
        const presentTitle = presentTitleEle.value;

        this.props.emit("start", {
            name: speakersName,
            title: presentTitle,
        });
    }

    render() {
        return (
            <form action="javascript:void(0)" onSubmit={this.start.bind(this)}>
                <label>Full Name</label>
                <input
                    ref={this.speakerNameRef}
                    className="form-control"
                    placeholder="enter your full name..."
                    required
                />

                <label>Presentation Title</label>
                <input
                    ref={this.presentTitleRef}
                    className="form-control"
                    placeholder="enter a title for this presentation..."
                    required
                />
                <button className="btn btn-primary">Join</button>
            </form>
        );
    }
};
