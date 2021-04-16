import React from "react";
import Amplify from 'aws-amplify';
import awsconfig from './aws-exports'
import { withAuthenticator } from '@aws-amplify/ui-react';

Amplify.configure(awsconfig);

function Products(){
    return (
        <div>
            <h1>Products Page!</h1>
        </div>
    )
}

export default Products;

// export default Home;