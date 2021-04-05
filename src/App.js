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

function getSessionURL(){
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

  website_url += "/$SESSION" + url_information["accessToken"] + "/$SESSION" + url_information['idToken']
  + "/$SESSION" + url_information["LastAuthUser"] + "/$SESSION" + url_information["userData"] + "/$SESSION"
  + url_information["serviceProvider"] + "/$SESSION" + JSON.stringify(additional_url_info)

  return website_url
}



// function App() {
//   let sessionURL = getSessionURL()
//   getUserData(sessionURL)
//   return (
//     <div className="App">
//       <header className="App-header">
//         <QRCode size={500} value={sessionURL}/>
//         <AmplifySignOut /> 
        
//       </header>
//     </div>
//   );
// }

function App(){
  return (
    <div className="App">
      <Router>
        <Navigation />
        <Switch>
          <Route path="/" exact component={() => <Landing />} />
          <Route path="/home" exact component={() => <Home />} />
          <Route path="/qrlanding" exact component={() => <QRLanding />} />
        </Switch>
      </Router>
    </div>
  )
}

export default withAuthenticator(App);

