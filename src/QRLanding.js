import React from "react";
import { Auth } from 'aws-amplify';
import ReactLoading from 'react-loading'
import key from './PrivateKey.js'

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
      password: '',
      password_verified: false,
      error_message: '',
      private_key: key,
      isLoading: false,
      qrGenerated: false,
      maxNumberAttempts: 3,
      loginAttempts: 0
    }
  }

  componentDidMount() {
    this.getCognitoUser()
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
      qr_link: this.state.website_url + encrypted_username + '$SESSION$' + encrypted_password,
      password: '',
      isLoading: false,
      qrGenerated: true
    })
  }

  verifyPassword() {
    this.setState({
      isLoading: true,
      loginAttempts: this.state.loginAttempts + 1
    })
    async function attemptSignIn(user, password) {
      return await Auth.signIn(user, password)
    }
    const signIn = attemptSignIn(this.state.cognitoUser['attributes']['email'], this.state.password)
    signIn.then(function (result) {
      if (result) {
        this.setState({
          password_verified: true,
        }, function () {
          this.encryptCredentials()
        })
      }
    }.bind(this)).catch(error => {
      if (error){
        this.setState({
          error_message: 'Sorry your password was incorrect, please try again',
          password: '',
          isLoading: false
        })
      }
    })

  }


  render() {
    return (
      <div>
        <div id="verify-password">
          <h3 style={{ marginTop: "3%" }}>{this.state.qrGenerated ? 'QR Code Generated!' : this.state.error_message.length > 0 ? 
          'Sorry your password was incorrect, please try again' : 'Please verify your password to generate QR Code'}</h3>
          <div style={{display: this.state.isLoading ? 'none' : this.state.qrGenerated? 'none' : 'block'}} >
            <input value={this.state.password} onChange={this.handleChange.bind(this)} type="password"></input>
            <button onClick={this.verifyPassword.bind(this)}>Generate QR Code</button>
          </div>
        </div>
        {this.state.isLoading ?
          <div style={{marginTop: "5%", marginLeft: "45%"}}>
            <ReactLoading type={'spin'} color={'blue'} height={'20%'} width={'20%'} />
          </div> :
          <div style={{ marginTop: "5%", display: this.state.qrGenerated> 0 ? 'block' : 'none' }}>
            <QRCode size={400} value={this.state.qr_link} />
          </div>}

      </div>

    );


  }
}



export default QRLanding;