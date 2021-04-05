import React from "react";
import {Amplify, Auth} from 'aws-amplify';

var QRCode = require('qrcode.react');

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

function QRLanding() {
    let sessionURL = getSessionURL()
    return (
        <div className="App">
            <header className="App-header">
                <h1 style={{marginBottom: "10%"}}>QR Landing Page</h1>
                <QRCode size={500} value={sessionURL} />

            </header>
        </div>
    );
}




// function QRLanding() {
//     return (
//         <div>
//             <h2>QR Landing Page!</h2>
//         </div>
//     )
// }

export default QRLanding;