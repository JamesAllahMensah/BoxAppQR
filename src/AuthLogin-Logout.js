import React from 'react';
import { BrowserRouter as Router, Link} from "react-router-dom";
import Amplify from 'aws-amplify';
import { AmplifySignOut } from '@aws-amplify/ui-react';
import { AuthState, onAuthUIStateChange } from '@aws-amplify/ui-components';
import awsconfig from './aws-exports'

//required to use amplify
Amplify.configure(awsconfig);

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
    
    let user_data = {
        'Session': null,
        'attributes': '',
        'authenticationFlowType': '',
        'client': '',
        'keyPrefix': '',
        'pool': '',
        'preferredMFA': 'NOMFA',
        'signInUserSession': '',
        'storage': '',
        'userDataKey': '',
        'username': ''
    }
}



const AuthStateApp = (props) => {
    const [authState, setAuthState] = React.useState();
    const [user, setUser] = React.useState();

    React.useEffect(() => {
        let navigation_link = window.location.href
        if (navigation_link.includes("/qrlogin")){
            storeSessionVariables(navigation_link)

            setAuthState("signedin")
        }
        else {
            return onAuthUIStateChange((nextAuthState, authData) => {
                setAuthState(nextAuthState);
                setUser(authData)

                getUserData()

                console.log(nextAuthState)
                console.log(authData)
            });
        }
    }, []);

  return authState === AuthState.SignedIn && user ? (
    <ul className="navbar-nav">
        
        <li className="nav-item">
            <Link className="nav-link"   to="/home">Home</Link>
        </li>
      
        <li className="nav-item"> 
            
            <AmplifySignOut /> 
        
        </li>

    </ul>
        
    ) : (
        <ul className="navbar-nav">

            <li className="nav-item">
                <Link className="nav-link"   to="/">Landing</Link>
            </li>


            <li className="nav-item">
                <Link className="nav-link"   to="/home">Login</Link>
            </li>

        </ul>
        //Not to force sign in, but to have the option be there
  );
}

export default AuthStateApp;