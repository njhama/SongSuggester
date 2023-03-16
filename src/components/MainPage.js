import React from 'react';
import axios from 'axios'
function MainPage(props) {
    const {token} = props;

  return (
    <div>
      <h1>Welcome to the Spotify Quiz App!</h1>
      <p>{token}</p>
    </div>
  );
}

export default MainPage;
