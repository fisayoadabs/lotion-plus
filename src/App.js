import { Link, useNavigate } from "react-router-dom";
import React, { useState, useEffect } from 'react';
import { googleLogout, useGoogleLogin } from '@react-oauth/google';
import axios from 'axios';
import Layout from "./Layout";

function App() {
    const [ user, setUser ] = useState(null);
    const [ profile, setProfile ] = useState(null);
    const direct = useNavigate();

    const login = useGoogleLogin({
        onSuccess: (codeResponse) => setUser(codeResponse),
        onError: (error) => console.log('Login Failed:', error)
    });

    useEffect(
        () => {
            if (user) {
                axios
                    .get(`https://www.googleapis.com/oauth2/v1/userinfo?access_token=${user.access_token}`, {
                        headers: {
                            Authorization: `Bearer ${user.access_token}`,
                            Accept: 'application/json'
                        }
                    })
                    .then((res) => {
                        setProfile(res.data);
                    })
                    .catch((err) => console.log(err));
            }
        },
        [ user ]
    );
    

    // log out function to log the user out of google and set the profile array to null
    const logOut = () => {
        googleLogout();
        setProfile(null);
        direct(`/`, {replace:true});
    };
  return (
      <div>
          {profile ? (
              <div>
                <Layout logOut={logOut} profile={profile} user={user}/>
              </div>
          ) : (
            <>
              <header>
                <aside>
                  <button id="menu-button">
                    &#9776;
                  </button>
                </aside>
                <div id="app-header">
                  <h1>
                    <Link to="/notes">Lotion</Link>
                  </h1>
                  <h6 id="app-moto">Like Notion, but worse.</h6>
                </div>
                <aside>&nbsp;</aside>
              </header>
              <button id="sign-in" onClick={() => login()}>Sign in to Lotion with &#x0047;</button>
            </>
          )}
      </div>
  );
}

export default App;
