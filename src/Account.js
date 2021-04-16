import React from "react";
import Amplify from 'aws-amplify';
import awsconfig from './aws-exports'
import { withAuthenticator } from '@aws-amplify/ui-react';

Amplify.configure(awsconfig);

function Account(){
    return (
        <div>
            <h1>Accounts Page!</h1>
        </div>
    )
}

export default Account;

// export default Home;