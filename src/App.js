import logo from './logo.svg';
import './App.css';
import React, { useState, useEffect} from 'react';
import MainPage from './components/MainPage';
import './index.css'

function App() {
  const scope = 'user-read-private user-read-email playlist-read-private user-top-read';

  const CLIENT_ID = "e274806929574399a5e9250ccc04c7ad";
  const REDIRECT_URI = "http://localhost:3000";
  const AUTH_ENDPOINT = "https://accounts.spotify.com/en/authorize";
  const  REPSONSE_TYPE = "token";

  const [token, setToken] = useState("");

  useEffect( () => {
    
    const hash = window.location.hash;
    let token = window.localStorage.getItem("token");
    
    if (!token && hash) {
      token = hash.substring(1).split("&").find(elem => elem.startsWith("access_token")).split("=")[1];
      
      window.location.hash = "";
      window.localStorage.setItem('token', token);
      
     
    }
    setToken(token);

    
  }, [])


  if (!token) {
    return (
      <div>
        <h1>Song Suggester</h1>
        <a href={`${AUTH_ENDPOINT}?client_id=${CLIENT_ID}&redirect_uri=${REDIRECT_URI}&response_type=token&scope=${scope}`}>
          Login with Spotify
        </a>
  
      </div>
    );
  }
  else {
    return (
      <MainPage token = {token}></MainPage>
    )
  }
  
}

export default App;
