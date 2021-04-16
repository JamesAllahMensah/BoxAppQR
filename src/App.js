import logo from './logo.svg';
import './App.css';
import {Amplify, Auth} from 'aws-amplify';
import awsconfig from './aws-exports'
import {AmplifySignOut, withAuthenticator } from '@aws-amplify/ui-react'
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import Navigation from './Navigation';
import Home from './Home';
import Products from './Products';
import Account from './Account';
import GetStarted from './GetStarted';
import Contact from './Contact'
import Landing from './Landing';
import QRLanding from './QRLanding';

Amplify.configure(awsconfig)



// function App() {
//   let sessionURL = getSessionURL()
//   getUserData(sessionURL)
//   return (
//     <div className="App">
//       <header className="App-header">
//         <QRCode size={500} value={sessionURL}/>
//         <AmplifySignOut /> 
        
//       </header>
//     </div>
//   );
// }

function App(){
  return (
    <div className="App">
      <Router>
        <Navigation />
        <Switch>
          <Route path="/" exact component={() => <Landing />} />
          <Route path="/home" exact component={() => <Home />} />
          <Route path="/qrlanding" exact component={() => <QRLanding />} />
          <Route path="/products" exact component={() => <Products />} />
          <Route path="/contact" exact component={() => <Contact />} />
          <Route path="/account" exact component={() => <Account />} />
          <Route path="/GettingStarted" exact component={() => <GetStarted />} />
        </Switch>
      </Router>
    </div>
  )
}

export default App;

