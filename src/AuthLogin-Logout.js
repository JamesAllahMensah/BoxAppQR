import React from 'react';
import { BrowserRouter as Router, Link } from "react-router-dom";
import Amplify, { Auth } from 'aws-amplify';
import { AmplifySignOut } from '@aws-amplify/ui-react';
import { AuthState, onAuthUIStateChange } from '@aws-amplify/ui-components';
import awsconfig from './aws-exports'
import key from './PrivateKey.js'
import {
    Nav,
    NavLink,
    Bars,
    NavMenu,
    NavBtn,
    NavBtnLink
  } from './styles/NavBarElements';

//required to use amplify
var CryptoJS = require('crypto-js')
Amplify.configure(awsconfig);


const AuthStateApp = (props) => {
    const [authState, setAuthState] = React.useState();
    const [user, setUser] = React.useState();

    React.useEffect(() => {
        let navigation_link = window.location.href
        if (navigation_link.includes("/qrlogin")) {
            let encrypted_user = navigation_link.split('/qrlogin/')[1].split('$SESSION$')[0].toString()
            let encrypted_password = navigation_link.split('/qrlogin/')[1].split('$SESSION$')[1]

            let user = CryptoJS.AES.decrypt(encrypted_user, key).toString(CryptoJS.enc.Utf8)
            let password = CryptoJS.AES.decrypt(encrypted_password, key).toString(CryptoJS.enc.Utf8)

            async function signIN(){
                return await Auth.signIn(user, password)
            }
            const cognitoUser = signIN()
            cognitoUser.then(function(result) {
                setAuthState('signedin')
                setUser(result)
            })
            
        }
        else {
            return onAuthUIStateChange((nextAuthState, authData) => {
                setAuthState(nextAuthState);
                setUser(authData)
            });
        }
    }, []);

    return authState === AuthState.SignedIn && user ? (
        <Nav>      
        <NavLink to='/'>
                <img src='https://imgur.com/VCf6kEX.png' width="25px" height="25px"/>
        </NavLink>
        <NavMenu className="nav-item">
            <NavLink to="/home" activeStyle>
                Home
            </NavLink>

            <NavLink to="/products" activeStyle>
                Products
            </NavLink>

            <NavLink to="/contact" activeStyle>
                Contact
            </NavLink>

            <NavLink to="/account" activeStyle>
                Account
            </NavLink>
        
            <NavLink to="/GettingStarted" activeStyle>
                Get started
            </NavLink>

            <NavLink to="/qrlanding" activeStyle>
                Mobile Sign In
            </NavLink>

        </NavMenu>
            <NavBtn>
                <AmplifySignOut /> 
            </NavBtn>
    </Nav>
    ) : (
        
        <ul className="navbar-nav">
             
             
            <li className="navbar-brand" to="/">
                <img src='https://imgur.com/VCf6kEX.png' width="25px" height="25px"/>

            </li>

            <li className="nav-item">
                <Link className="nav-link"   to="/">Welcome</Link>
            </li>

            <li className="nav-item">
                <Link className="nav-link"   to="/about">About</Link>
            </li>

            <li className="nav-item">
                <Link className="nav-link"   to="/home">Login</Link>
            </li>
            
        </ul>
        //Not to force sign in, but to have the option be there
  );

}

export default AuthStateApp;