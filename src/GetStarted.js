import React from "react";
import Amplify from 'aws-amplify';
import awsconfig from './aws-exports'
import { withAuthenticator } from '@aws-amplify/ui-react';

Amplify.configure(awsconfig);

function GetStarted(){
    return (
        <div>
            <h1>Get Started Page!</h1>
        </div>
    )
}

export default GetStarted;

// export default Home;