import React from "react";
import {AppContext} from "../contexts";


export default class AlertBanner extends React.Component {
    static contextType = AppContext

    render() {
        const {status} = this.context.state;

        return (
            status !== "connected" && (
                <div class="alert alert-danger" role="alert">
                    <strong>Disconnected from server</strong>
                    <span>, please check your network connection</span>
                </div>
            )
        );
    }
}
