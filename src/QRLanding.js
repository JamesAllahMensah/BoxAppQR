import React from "react";
import {Amplify, Auth} from 'aws-amplify';
import BoxImage from './photo/box_image.png'


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
        <div style={{marginLeft: "35%", marginTop: "5%"}}>
          <div style={{position: "absolute", zIndex: "10", marginLeft: "5%", marginTop: "2%"}}>
            <h1>Login on Mobile Client</h1>
          </div>
          <div style={{position: "absolute"}}>
            <img src={BoxImage} style={{width: "100%"}}></img>
          </div>
          <div style={{position: "absolute", zIndex: "1", marginTop: "10%", marginLeft: "4%"}}>
            <QRCode size={350} value={sessionURL} />
          </div>
          <div style={{position: "absolute", zIndex: "10", marginTop: "32%"}}>
            <h3>Scan this on any <i>Device</i> with a <i>Camera</i> to <i>Automatically Authenticate </i>!</h3>
          </div>
        </div>
    );
}


export default QRLanding;