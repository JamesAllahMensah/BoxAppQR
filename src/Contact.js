import React from "react";
import Amplify from 'aws-amplify';
import awsconfig from './aws-exports'
import { withAuthenticator } from '@aws-amplify/ui-react';

Amplify.configure(awsconfig);

function Contact(){
    return (
        <div>
            <h1>Contact Page!</h1>
        </div>
    )
}

export default Contact;

// export default Home;