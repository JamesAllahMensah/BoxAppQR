import React from "react";
import Amplify from 'aws-amplify';
import awsconfig from './aws-exports'
import { withAuthenticator } from '@aws-amplify/ui-react';

Amplify.configure(awsconfig);

function Home(){
    return (
        <div>
            <h1>Home Page!</h1>
        </div>
    )
}

export default withAuthenticator(Home);