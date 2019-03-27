const React = require('react');

export default class JoinSpeaker extends React.Component {

    start(){
        const speakersName = this.refs.name.value;
        const presentationTitle = this.refs.title.value;
        this.props.emit('start', {
            name: speakersName,
            title: presentationTitle
        });
    }

    render(){
        return (
            <form action="javascript:void(0)" onSubmit={this.start}>
                <label>Full Name</label>
                <input ref="name" className="form-control"
                       placeholder="enter your full name..."
                       required
                    />

                <label>Presentation Title</label>
                <input ref="title" className="form-control"
                       placeholder="enter a title for this presentation..."
                       required
                    />
                <button className="btn btn-primary">Join</button>
            </form>
        );
    }
};
