import React from "react";
import { Amplify, Auth } from 'aws-amplify';
import { render } from "@testing-library/react";
import PrivateKey from './PrivateKey'

var QRCode = require('qrcode.react');
var CryptoJS = require('crypto-js')
var AWS = require('aws-sdk');

class QRLanding extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      cognitoUser: {},
      qr_link: '',
      website_url: 'http://localhost:3000/qrlogin/',
      totpGenerated: false,
      password: '',
      password_verified: false,
      error_message: '',
      private_key: '',
      keyReceived: true
    }
  }

  componentDidMount() {
    this.getCognitoUser()
  }
  
  componentDidUpdate(){
    this.storePrivateKey()
  }

  storePrivateKey(){
    if (!this.state.keyReceived){
      this.setState({
        private_key: document.getElementById('private_key').innerHTML,
        keyReceived: true
      })
    }
    
  }

  getCognitoUser = (event) => {
    async function getUser() {
      return await Auth.currentAuthenticatedUser()
    }
    const cognitoUser = getUser()
    cognitoUser.then(function (result) {
      this.setState({
        cognitoUser: result
      })
    }.bind(this))
  }

  handleChange = (event) => {
    this.setState({
      password: event.target.value
    })
  }


  encryptCredentials() {
    let encrypted_username = CryptoJS.AES.encrypt(this.state.cognitoUser['attributes']['email'], this.state.private_key).toString()
    let encrypted_password = CryptoJS.AES.encrypt(this.state.password, this.state.private_key).toString()
    
    this.setState({
      qr_link: this.state.website_url + '$USER$=' + encrypted_username + '$PASS$=' + encrypted_password,
      password: ''
    })
  }

  verifyPassword() {
    async function attemptSignIn(user, password) {
      return await Auth.signIn(user, password)
    }
    const signIn = attemptSignIn(this.state.cognitoUser['attributes']['email'], this.state.password)
    signIn.then(function (result) {
      if (result) {
        this.setState({
          password_verified: true,
        }, function(){
          this.encryptCredentials()
        })
      }
      else {
        this.setState({
          error_message: 'Sorry your password was incorrect, please try again',
          password: ''
        })
      }
    }.bind(this))

  }


  render() {
    return (
      <div>
        <PrivateKey id={'private_key'}/>
        <div id="verify-password">
          <h3 style={{ marginTop: "3%" }}>Please verify your password to generate QR Code</h3>
          <input value={this.state.password} onChange={this.handleChange.bind(this)} type="password"></input>
          <button onClick={this.verifyPassword.bind(this)}>Generate QR Code</button>
          {this.state.error_message.length > 0 ?
            <div>
              <h3 style={{ marginTop: "3%" }}>{this.state.error_message}</h3>
            </div> :
            <div>
            </div>}
        </div>
        <div style={{ marginTop: "5%", display: this.state.qr_link.length > 0 ? 'block' : 'none' }}>
          <QRCode size={400} value={this.state.qr_link} />
        </div>
      </div>

    );


  }
}



export default QRLanding;