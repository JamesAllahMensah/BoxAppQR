import logo from './logo.svg';
import './App.css';
import {Amplify, Auth} from 'aws-amplify';
import awsconfig from './aws-exports'
import {AmplifySignOut, withAuthenticator } from '@aws-amplify/ui-react'
// import CryptoJS from 'crypto-js'

var QRCode = require('qrcode.react');
var CryptoJS = require("crypto-js");

Amplify.configure(awsconfig)

function getSessionURL(){
  let website_url = "https://tyler-warburton.com/home"
  let url_information = {}


  for (const [key, value] of Object.entries(localStorage)) {
    let identifier = key.split(".")[key.split(".").length - 1]
    url_information[identifier] = value
  }

  website_url += "/$SESSION" + url_information["accessToken"] + "/$SESSION" + url_information['idToken']
  + "/$SESSION" + url_information["LastAuthUser"] + "/$SESSION" + url_information["userData"]
  return website_url
}

function storeSessionVariables(website_url){
  let session_variables = website_url.split("/$SESSION")
  let accessToken = session_variables[1]
  let idToken = session_variables[2]
  let LastAuthUser = session_variables[3]
  let userData = session_variables[4]

  let local_storage_variables = {
    "accessToken": "",
    "idToken": "",
    "LastAuthUser": "",
    "userData": ""
  }

  for (const [key] of Object.entries(localStorage)) {
    let storage_key = key.split(".")[key.split(".").length - 1]
    let matching_key = Object.keys(local_storage_variables).filter(item => item === storage_key)[0]
    if (matching_key === storage_key){
      local_storage_variables[matching_key] = key
    }
  }

  console.log(local_storage_variables)

  localStorage.setItem(local_storage_variables["accessToken"], accessToken)
  localStorage.setItem(local_storage_variables["idToken"], idToken)
  localStorage.setItem(local_storage_variables["LastAuthUser"], LastAuthUser)
  localStorage.setItem(local_storage_variables["userData"], userData)
}


function App() {
  let sessionURL = getSessionURL()
  storeSessionVariables(sessionURL)
  return (
    <div className="App">
      <header className="App-header">
        <QRCode size={500} value={sessionURL}/>
        <AmplifySignOut /> 
        
      </header>
    </div>
  );
}

export default withAuthenticator(App);

