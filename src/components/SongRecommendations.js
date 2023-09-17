import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './SongRec.css';

import { useQuery, gql, useMutation } from '@apollo/client';
import { ApolloClient, InMemoryCache, ApolloProvider } from '@apollo/client';

const FETCH_TOP_SONGS = gql`
  query FetchTopSongs($timeRange: String!) {
    topSongs(timeRange: $timeRange) {
      id
      name
      artist
      album
    }
  }
`;


const SAVE_TOP_SONGS = gql`
  mutation SaveTopSongs($songs: [TopSongInput!]!) {
    saveTopSongs(songs: $songs) {
      id
      name
      artist
      album
    }
  }
`;

function SongRec() {
  const [topTracks,  setTopTracks] = useState([]);
  const [recommendedTracks, setRecommendedTracks] = useState([]);
  const [timeRange, setTimeRange] = useState('long_term');
  const { loading, error, data } = useQuery(FETCH_TOP_SONGS, {
    variables: { timeRange },
  })

  const [saveTopSongs, { data: savedTopSongsData }] = useMutation(SAVE_TOP_SONGS);

  
  

  function handleTimeRangeChange(event) {
    setTimeRange(event.target.value);
  }

  // Function to save top songs when the button is clicked
  function handleSaveTopSongs() {
    console.log(topTracks);
    console.log('here')
    try {
      saveTopSongs({
        variables: {
          songs: topTracks.map((track) => ({
            id: track.id,
            name: track.name,
            artist: track.artist,
            album: track.album,
          })),
        },
      }).then((response) => {
        console.log('Top songs saved:', response.data.saveTopSongs);
      });
    } catch (error) {
      console.error('Error saving top songs:', error);
    }

    console.log('done')
  }
  
 
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


      <h2>Past Songs</h2>
      <table>
        <thead>
          <tr>
            <th>Album</th>
            <th>Song</th>
            <th>Artist</th>
          </tr>
        </thead>
        <tbody>
  {loading ? (
    <tr>
      <td>Loading saved top songs...</td>
    </tr>
  ) : error ? (
    <tr>
      <td>Error loading saved top songs.</td>
    </tr>
  ) : savedTopSongsData && savedTopSongsData.saveTopSongs ? (
    savedTopSongsData.saveTopSongs.map((track) => (
      <tr key={track.id}>
        <td>{track.album}</td>
        <td>{track.name}</td>
        <td>{track.artist}</td>
      </tr>
    ))
  ) : (
    <tr>
      <td>No saved top songs available.</td>
    </tr>
  )}
</tbody>

      </table>
      <button onClick={handleSaveTopSongs}>Save Top Songs</button>
    </div>
  );
}

export default SongRec;
