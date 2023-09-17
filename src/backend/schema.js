const { gql } = require('apollo-server-express');

const typeDefs = gql`
  type Song {
    id: ID!
    name: String!
    artist: String!
    album: String!
  }

  input TopSongInput {
    id: ID!
    name: String!
    artist: String!
    album: String!
  }

  type Query {
    topSongs(timeRange: String!): [Song]
  }

  type Mutation {
    saveTopSongs(songs: [TopSongInput]): [Song]
  }
`;

module.exports = typeDefs;
