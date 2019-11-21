/* eslint-disable no-underscore-dangle */
/* eslint-disable class-methods-use-this */
import uuid from 'uuid';
import md5 from 'md5';
import UserModel from '../models/user';

const THIRTY_MINUTES = 30 * 60 * 1000;
export const TOKEN_EXPIRATION_PERIOD = THIRTY_MINUTES;

export const encrypt = password => md5(password);

export const generateAccessToken = () => ({
  token: uuid(),
  expiresAt: new Date(new Date().getTime() + THIRTY_MINUTES),
});

export const initUserDocument = (username, password, email, profile) => ({
  username,
  email,
  password: encrypt(password),
  profile,
  accessTokens: [],
});

class Users {
  async createAccount(username, password, email, profile) {
    const isExist = await UserModel.findByUsername(username);
    if (isExist) {
      throw new Error('Username already taken!');
    }

    const user = initUserDocument(username, password, email, profile);
    const accessToken = await this.addAccessTokenToUser(user);
    const userDoc = await UserModel.create(user);
    return { accessToken, user: userDoc };
  }

  async login(username, password) {
    const encrypted = encrypt(password);
    const user = await UserModel.findOne({ username, password: encrypted });
    if (!user) {
      throw new Error('Invalid username or password!');
    }
    UserModel.update({ _id: user._id }, { $set: { lastLoginDate: new Date() } });
    const accessToken = await this.addAccessTokenToUser(user);

    return { accessToken, user };
  }

  logout(token) {
    const user = UserModel.findByToken(token);
    if (!user) return;
    const filteredAccessTokens = user.accessTokens.filter(accessToken => accessToken.token !== token);
    UserModel.update({ _id: user._id }, { $set: { accessTokens: filteredAccessTokens } });
  }

  async updateAccount(_id, username, modifier) {
    const exists = await UserModel.findByUsername(modifier.username);
    if (!!exists && modifier.username !== username) {
      throw new Error('Username is taken. Please use another username');
    }
    await UserModel.updateOne({ _id }, { $set: { ...modifier } });
    const user = await UserModel.findById(_id);
    return user;
  }

  async update(_id, modifier) {
    // TODO: validate
    await UserModel.updateOne({ _id }, { $set: { ...modifier } });
    const user = await UserModel.findById(_id);
    return user;
  }

  async changePassword(user, password, newPassword) {
    const { _id, password: currentPassword } = user;
    const exists = !!UserModel.findById(_id);
    if (!exists) {
      throw new Error('User not found!');
    }
    if (currentPassword !== encrypt(password)) {
      throw new Error('Password not match. Please input correct password');
    }
    const result = await UserModel.updateOne({ _id }, { $set: { password: encrypt(newPassword) } });
    return result;
  }

  async addAccessTokenToUser(user) {
    const accessToken = generateAccessToken();

    const accessTokens = [...user.accessTokens, accessToken];

    if (user._id) {
      await UserModel.updateOne({ _id: user._id }, { $addToSet: { accessTokens: accessToken } });
    }
    // eslint-disable-next-line no-param-reassign
    user.accessTokens = accessTokens;
    return accessToken;
  }

  findUserById(userId) {
    return UserModel.findById(userId);
  }

  findUserByUsername(username) {
    return UserModel.findByUsername(username);
  }
}

export default new Users();
