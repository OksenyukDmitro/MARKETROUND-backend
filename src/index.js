import loadGraphQLServer from './graphql';
import loadDB from './models';

const startup = async () => {
  await loadDB();
  await loadGraphQLServer();
};

startup();
