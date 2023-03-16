import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './SongRec.css';

function SongRec() {
  const [topTracks, setTopTracks] = useState([]);
  const [recommendedTracks, setRecommendedTracks] = useState([]);
  const [timeRange, setTimeRange] = useState('long_term');

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      axios.get(`https://api.spotify.com/v1/me/top/tracks?limit=5&time_range=${timeRange}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })
      .then(response => {
        const trackIds = response.data.items.map(track => track.id);
        axios.get('https://api.spotify.com/v1/recommendations', {
          headers: {
            'Authorization': `Bearer ${token}`
          },
          params: {
            'limit': 20,
            'seed_tracks': trackIds.join(',')
          }
        })
        .then(response => {
          setRecommendedTracks(response.data.tracks);
        })
        .catch(error => {
          console.log(error);
        });
        setTopTracks(response.data.items);
      })
      .catch(error => {
        console.log(error);
      });
    }
  }, [timeRange]);

  function handleTimeRangeChange(event) {
    setTimeRange(event.target.value);
  }

  return (
    <div>
      <div>
        <label htmlFor="time-range">Time Range:</label>
        <select id="time-range" value={timeRange} onChange={handleTimeRangeChange}>
          <option value="short_term">Last 4 weeks</option>
          <option value="medium_term">Last 6 months</option>
          <option value="long_term">All Time</option>
        </select>
      </div>

      <h2>My Top Songs:</h2>
      <table>
        <thead>
          <tr>
            <th>Album</th>
            <th>Song</th>
            <th>Artist</th>
          </tr>
        </thead>
        <tbody>
          {topTracks.map(track => (
            <tr key={track.id}>
              <td><img src={track.album.images[0].url} alt={track.album.name} /></td>
              <td>{track.name}</td>
              <td>{track.artists[0].name}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <h2>Recommended Songs:</h2>
      <table>
        <thead>
          <tr>
            <th>Album</th>
            <th>Song</th>
            <th>Artist</th>
          </tr>
        </thead>
        <tbody>
          {recommendedTracks.map(track => (
            <tr key={track.id}>
              <td><img src={track.album.images[0].url} alt={track.album.name} /></td>
              <td>{track.name}</td>
              <td>{track.artists[0].name}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default SongRec;
