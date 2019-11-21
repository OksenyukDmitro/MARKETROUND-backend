import loadGraphQLServer from './graphql';
import loadDB from './models';
// import faker from 'faker';
// import AuthService from './services/auth';

// const createFakeUser = () => {
//   const username = faker.internet.userName();
//   const password = faker.internet.password();
//   const profile = {
//     avatar: faker.internet.avatar(),
//     firstName: faker.name.firstName(),
//     lastName: faker.name.lastName(),
//   };
//   return AuthService.createAccount(username, password, profile);
// };
const startup = async () => {
  await loadDB();
  await loadGraphQLServer();
};

startup();
