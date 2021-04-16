import React from "react";
import { Amplify, Auth } from 'aws-amplify';
import { render } from "@testing-library/react";

var AWS = require('aws-sdk');

class PrivateKey extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            private_key: ''
        }
    }

    componentDidMount() {
        this.getPrivateKey()
    }

    getPrivateKey() {
        AWS.config.update(
            {
                accessKeyId: "AKIAWRYQXG7XLD4GE4XY",
                secretAccessKey: "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",
            }
        );
        var s3 = new AWS.S3({ 'apiVersion': '2006-03-01' });
        s3.getObject(
            { Bucket: "boxprivatekey", Key: "key" },
            function (error, data) {
                this.setState({
                    private_key: data.Body.toString('utf-8').split('-----')[2]
                })
            }.bind(this)
        );
    }

    render() {
        return (<div style={{display: !this.props.show ? 'none' : 'block'}} id={this.props.id} className={this.props.className}>{this.state.private_key}</div>)
    }
}



export default PrivateKey;