import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Button from 'react-bootstrap/Button';
import SongR from './SongRecommendations'


function MainPage(props) {
  const { token } = props;
  const [tracks, setTracks] = useState([]);

  useEffect(() => {
    console.log(token);
    axios.get("https://api.spotify.com/v1/me/top/tracks", {
      headers: {
        Authorization: `Bearer ${token}`
      },
      params: {
        limit: 50
      }
    }).then(response => {
      setTracks(response.data.items);
      console.log(response.data.items)
    }).catch(error => {
      console.log(error);
    });

    
  }, [token]);

  return (
    <div>
      <h1>SongSuggester</h1>
      <SongR> </SongR>
    </div>
  );
}

export default MainPage;
