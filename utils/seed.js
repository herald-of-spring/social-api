const connection = require('../config/connection');
const { User, Thought } = require('../models');

connection.on('error', (err) => err);

connection.once('open', async () => {
  await User.deleteMany({});
  await Thought.deleteMany({});

  await User.collection.insertMany([{
    username: "Soraya",
    email: "soraya@example.com"
  }, {
    username: "Gideon",
    email: "gideon@example.com"
  }, {
    username: "Otto",
    email: "otto@example.com"
  }, {
    username: "Lloyd",
    email: "lloyd@example.com"
  }, {
    username: "Laocoon",
    email: "laocoon@example.com"
  }, {
    username: "Cassandra",
    email: "cassandra@example.com"
  }]);

  console.info('Default data seeded.');
  process.exit(0);
});
