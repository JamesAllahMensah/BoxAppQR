import React from "react";
import { Link, withRouter } from "react-router-dom";
import AuthStateApp from './AuthLogin-Logout';


//Great documentation here:
//https://getbootstrap.com/docs/4.0/components/navs/

function Navigation(props) {
    return (
        <div className="navigation">
            <nav className="navbar navbar-expand navbar-dark bg-dark">
                <div className="container">
                    <ul className="navbar-nav">
                        <Link className="navbar-brand" to="/">
                            <img src='https://imgur.com/VCf6kEX.png' width="25px" height="25px" />
                        </Link>
                        <AuthStateApp />
                    </ul>
                </div>
            </nav>
        </div>
    );
}

export default withRouter(Navigation);
