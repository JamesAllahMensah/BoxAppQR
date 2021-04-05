import React from 'react';
import { BrowserRouter as Router, Link } from "react-router-dom";
import Amplify from 'aws-amplify';
import { AmplifySignOut } from '@aws-amplify/ui-react';
import { AuthState, onAuthUIStateChange } from '@aws-amplify/ui-components';
import awsconfig from './aws-exports'

//required to use amplify
Amplify.configure(awsconfig);

/**
 * Navigation Link is parsed for authentication session data and stored into localstoraage, giving the user
 * immediate access to their account via the QR code link
 * @param {*} website_url 
 */
function storeSessionVariables(website_url) {
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

/**
 * Navigation Link, containing the authentication session data is parsed and stored
 * into an artificial authentication object. This object stores the session authentication data into the session storage.
 * @param {*} website_url 
 * @returns 
 */
function getUserData(website_url) {
    let session_variables = website_url.split("/$SESSION")
    console.log(session_variables)

    let accessToken = session_variables[1]
    let idToken = session_variables[2]
    let LastAuthUser = session_variables[3]
    let userData = JSON.parse(parseUserData(session_variables[4]))
    let userDataArray = userData['UserAttributes'].map(data => data.Name)
    let serviceProvider = session_variables[5]
    let authData = JSON.parse(parseUserData(session_variables[6]))

    let storageAccessToken = serviceProvider + ".accessToken"
    let storageClockDrift = serviceProvider + ".clockDrift"
    let storageIdToken = serviceProvider + ".idToken"
    let storageRefreshToken = serviceProvider + ".refreshToken"
    let storageLastAuthUser = serviceProvider.split(".")[0] + serviceProvider.split(".")[1] + ".LastAuthUser"
    let storageUserData = serviceProvider + ".userData"
    let clientID = serviceProvider.split(".")[1]

    let user_data = {
        'Session': null,
        'attributes': {
            'email': userData['UserAttributes'][userDataArray.indexOf("email")]["Value"],
            'email_verified': userData['UserAttributes'][userDataArray.indexOf("email_verified")]["Value"],
            'phone_number': userData['UserAttributes'][userDataArray.indexOf("phone_number")]["Value"],
            'phone_number_verified': userData['UserAttributes'][userDataArray.indexOf("phone_number_verified")]["Value"],
            'sub': userData['UserAttributes'][userDataArray.indexOf("sub")]["Value"],
        },
        'authenticationFlowType': 'USER_SRP_AUTH',
        'client': {
            'endpoint': 'https://cognito-idp-us-east-2-amazonaws.com/',
            'fetchOptions': {},
            'keyPrefix': 'CognitoIdentityServiceProvider' + "." + serviceProvider.split(".")[1]
        },
        'pool': {
            'advancedSecurityDataCollectionFlag': true,
            'client': {
                'endpoint': 'https://cognito-idp-us-east-2-amazonaws.com/',
                'fetchOptions': {},
            },
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
            'userPoolId': authData['userPoolId']
        },
        'preferredMFA': 'NOMFA',
        'signInUserSession': {
            'accessToken': {
                'jwtToken': idToken,
                'payload': {
                    'auth_time': 1616570471,
                    'client_id': clientID,
                    'event_id': authData['eventId'],
                    'exp': authData['exp'],
                    'iat': authData['iat'],
                    'iss': authData['iss'],
                    'jti': authData['jti'],
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
                    'auth_time': authData['auth_time'],
                    'cognito:username': LastAuthUser,
                    'email': userData['UserAttributes'][userDataArray.indexOf("email")]["Value"],
                    'email_verified': userData['UserAttributes'][userDataArray.indexOf("email_verified")]["Value"],
                    'event_id': authData['eventId'],
                    'exp': authData['exp'],
                    'iat': authData['iat'],
                    'iss': authData['iss'],
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
        'userDataKey': serviceProvider + ".userData",
        'username': LastAuthUser
    }

    return user_data

}

/**
 * When brackets and quotes are stored into a URL the symbols are converted.
 * This function returns the converted symbols into the original symbols. 
 * @param {*} userData 
 * @returns 
 */
function parseUserData(userData){
    userData = userData.replaceAll("%22", "\"")
    userData = userData.replaceAll("%7B", "{")
    userData = userData.replaceAll("%7D", "}")
    return userData
}

function verifyNavigationLink(link){
    try {
        let parsed_link = link.split("/$SESSION")
        let idToken = parsed_link[2]
        if (parsed_link.length != 7){
            return false
        }
        else if (idToken.length != 1048){
            return false
        }
        else {
            return true
        }
    }
    catch (error){
        return false
    }
}



const AuthStateApp = (props) => {
    const [authState, setAuthState] = React.useState();
    const [user, setUser] = React.useState();

    React.useEffect(() => {
        let navigation_link = window.location.href
        if (navigation_link.includes("/qrlogin")) {
            if (verifyNavigationLink(navigation_link)){
                return onAuthUIStateChange((nextAuthState, authData) => {
                    setAuthState(nextAuthState);
                    setUser(authData)
                });
            }
            else {
                let authData = getUserData(navigation_link)
                storeSessionVariables(navigation_link)
                setUser(authData)
                setAuthState("signedin")
            }
            
        }
        else {
            return onAuthUIStateChange((nextAuthState, authData) => {
                setAuthState(nextAuthState);
                setUser(authData)
            });
        }
    }, []);

    return authState === AuthState.SignedIn && user ? (
        <ul className="navbar-nav">

            <li className="nav-item">
                <Link className="nav-link" to="/home">Home</Link>
            </li>

            <li className="nav-item">

                <AmplifySignOut />

            </li>

        </ul>

    ) : (
        <ul className="navbar-nav">

            <li className="nav-item">
                <Link className="nav-link" to="/">Landing</Link>
            </li>


            <li className="nav-item">
                <Link className="nav-link" to="/home">Login</Link>
            </li>

        </ul>
        //Not to force sign in, but to have the option be there
    );
}

export default AuthStateApp;