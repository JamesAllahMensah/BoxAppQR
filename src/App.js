import logo from './logo.svg';
import './App.css';
import {Amplify, Auth} from 'aws-amplify';
import awsconfig from './aws-exports'
import {AmplifySignOut, withAuthenticator } from '@aws-amplify/ui-react'
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import Navigation from './Navigation';
import Home from './Home';
import Landing from './Landing'
import QRLanding from './QRLanding'

var QRCode = require('qrcode.react');

Amplify.configure(awsconfig)

// console.log(Auth.userPool)


function getSessionURL(){
  console.log(Auth)
  // let userPool = Auth.userPool
  // let userPoolId = userPool.userPoolId
  // console.log(userPoolId)
  let website_url = "https://tyler-warburton.com/qrlogin"
  let url_information = {}
  

  for (const [key, value] of Object.entries(localStorage)) {
    let identifier = key.split(".")[key.split(".").length - 1]
    url_information[identifier] = value

    if (key.includes("CognitoIdentityServiceProvider") && key.includes("accessToken")){
      let serviceKey = key.slice(0, key.indexOf("accessToken") - 1)
      url_information['serviceProvider'] = serviceKey
    }
  }

  let id_payload_info = Auth.user.signInUserSession.idToken.payload
  let access_payload_info = Auth.user.signInUserSession.accessToken.payload

  let additional_url_info = {
    'userPoolId': Auth.userPool.userPoolId,
    'eventId': id_payload_info.event_id,
    'exp': id_payload_info.exp,
    'iat': id_payload_info.iat,
    'iss': id_payload_info.iss,
    'jti': access_payload_info.jti,
    'auth_time': id_payload_info.auth_time
  }

  console.log(additional_url_info)

  website_url += "/$SESSION" + url_information["accessToken"] + "/$SESSION" + url_information['idToken']
  + "/$SESSION" + url_information["LastAuthUser"] + "/$SESSION" + url_information["userData"] + "/$SESSION" + url_information["serviceProvider"]
  return website_url
}

function storeSessionVariables(website_url){
  let session_variables = website_url.split("/$SESSION")
  let accessToken = session_variables[1]
  let idToken = session_variables[2]
  let LastAuthUser = session_variables[3]
  let userData = session_variables[4]
  let serviceProvider = session_variables[5]

  localStorage.setItem(serviceProvider + ".accessToken", accessToken)
  localStorage.setItem(serviceProvider + ".idToken", idToken)
  localStorage.setItem(serviceProvider.split(".")[0] + serviceProvider.split(".")[1] + ".LastAuthUser", LastAuthUser)
  localStorage.setItem(serviceProvider + ".userData", userData)
}

function getUserData(website_url){
  let session_variables = website_url.split("/$SESSION")
  let accessToken = session_variables[1]
  let idToken = session_variables[2]
  let LastAuthUser = session_variables[3]
  let userData = JSON.parse(session_variables[4])
  let userDataArray = userData['UserAttributes'].map(data => data.Name)
  let serviceProvider = session_variables[5]

  let storageAccessToken = serviceProvider + ".accessToken"
  let storageClockDrift = serviceProvider + ".clockDrift"
  let storageIdToken = serviceProvider + ".idToken"
  let storageRefreshToken = serviceProvider + ".refreshToken"
  let storageLastAuthUser = serviceProvider.split(".")[0] + serviceProvider.split(".")[1] + ".LastAuthUser"
  let storageUserData = serviceProvider + ".userData" 
  let clientID = serviceProvider.split(".")[0] 
  
  let user_data = {
      'Session': null,
      'attributes': {
        'email': userData['UserAttributes'][userDataArray.indexOf("email")]["Value"],
        'email_verified' : userData['UserAttributes'][userDataArray.indexOf("email_verified")]["Value"],
        'phone_number' : userData['UserAttributes'][userDataArray.indexOf("phone_number")]["Value"],
        'phone_number_verified' : userData['UserAttributes'][userDataArray.indexOf("phone_number_verified")]["Value"],
        'sub' : userData['UserAttributes'][userDataArray.indexOf("sub")]["Value"],
      },
      'authenticationFlowType': 'USER_SRP_AUTH',
      'client': {
        'endpoint': 'https://cognito-idp-us-east-2-amazonaws.com/',
        'fetchOptions': {},
        'keyPrefix': 'CognitoIdentityServiceProvider' + serviceProvider
      },
      'pool': {
        'advancedSecurityDataCollectionFlag': true,
        'endpoint': 'https://cognito-idp-us-east-2-amazonaws.com/',
        'fetchOptions': {},
        'clientId': clientID,
        'storage': {
          [storageAccessToken]: accessToken,
          [storageClockDrift]: 0,
          [storageIdToken]: idToken,
          [storageRefreshToken]: '',
          [storageUserData]: JSON.stringify(userData),
          [storageLastAuthUser]: LastAuthUser,
          'amplify-signin-with-hostedUI': "false"
        },
        'userPoolId': '' // GET LATER
      },
      'preferredMFA': 'NOMFA',
      'signInUserSession': {
        'accessToken': {
          'jwtToken': idToken,
          'payload': {
            'auth_time': 1616570471,
            'client_id': clientID,
            'event_id': '',
            'exp': 1616596948,
            'iat': 1616593348,
            'iss': 'https://cognito-idp.us-east-2.amazonaws.com/us-east-2_z0DKRxlQO', // replace with ours later
            'jti': '2286b5fe-4106-4893-8525-ea7dffcdb086', // replace with ours
            'scope': 'aws.cognito.signin.user.admin',
            'sub': LastAuthUser,
            'token_use': 'access',
            'username': LastAuthUser
          },
          'clockDrift': 1
        },
        'idToken': {
          'jwtToken': idToken,
          'payload': {
            'aud': serviceProvider.split(".")[1],
            'auth_time': '',
            'cognito:username': LastAuthUser,
            'email': userData['UserAttributes'][userDataArray.indexOf("email")]["Value"],
            'email_verified': userData['UserAttributes'][userDataArray.indexOf("email_verified")]["Value"],
            'event_id': '',
            'exp': '',
            'iat': '',
            'iss': 'https://cognito-idp.us-east-2.amazonaws.com/_', // ADD user pool ID to it
            'phone_number': userData['UserAttributes'][userDataArray.indexOf("phone_number")]["Value"],
            'phone_number_verified': userData['UserAttributes'][userDataArray.indexOf("phone_number_verified")]["Value"],
            'sub': LastAuthUser,
            'token_use': 'id'
          }
        },
        'refreshToken': ''
      },
      'storage': {
        [storageAccessToken]: accessToken,
        [storageClockDrift]: 0,
        [storageIdToken]: idToken,
        [storageRefreshToken]: '',
        [storageUserData]: JSON.stringify(userData),
        [storageLastAuthUser]: LastAuthUser,
        'amplify-signin-with-hostedUI': "false"
      },
      'userDataKey': serviceProvider + "." + LastAuthUser + ".userData",
      'username': LastAuthUser
  }

}


function App() {
  let sessionURL = getSessionURL()
  getUserData(sessionURL)
  return (
    <div className="App">
      <header className="App-header">
        <QRCode size={500} value={sessionURL}/>
        <AmplifySignOut /> 
        
      </header>
    </div>
  );
}

// function App(){
//   return (
//     <div className="App">
//       <Router>
//         <Navigation />
//         <Switch>
//           <Route path="/" exact component={() => <Landing />} />
//           <Route path="/home" exact component={() => <Home />} />
//           <Route path="/qrlogin" exact component={() => <QRLanding />} />
//         </Switch>
//       </Router>
//     </div>
//   )
// }

export default withAuthenticator(App);

