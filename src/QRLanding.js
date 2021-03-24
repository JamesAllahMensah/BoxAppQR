import React from "react";

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
  
    website_url += "/$SESSION" + url_information["accessToken"] + "/$SESSION" + url_information['idToken']
    + "/$SESSION" + url_information["LastAuthUser"] + "/$SESSION" + url_information["userData"] + "/$SESSION" + url_information["serviceProvider"]
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