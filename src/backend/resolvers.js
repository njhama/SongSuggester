const songs = [
   

  ];
  
  const resolvers = {
    Query: {
      topSongs: (parent, { timeRange }) => {

        return songs;
      },
    },
    Mutation: {
      saveTopSongs: (parent, { songs }) => {

        return songs;
      },
    },
  };
  
  module.exports = resolvers;
  