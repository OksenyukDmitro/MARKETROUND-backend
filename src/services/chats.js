/* eslint-disable class-methods-use-this */
import ChatModel from '../models/chat';
import UserModel from './auth';
import MessageModel from '../models/message';

class ChatsService {
  async create({ createdBy, productId, productOwnerId }) {
    const chat = await ChatModel.create({ createdBy, productId, productOwnerId });
    const user = await UserModel.findUserById(createdBy);
    const chatsId = [chat._id, ...user.chatsId];
    UserModel.update(createdBy, { chatsId });
    return chat;
  }

  async addMessage({ chatId, body, createdBy }) {
    const chat = await this.findByChatId(chatId);
    const message = MessageModel.create({ chatId, body, createdBy });
    const messages = [message, ...chat.messages];
    this.update(chatId, { messages });
    return messages;
  }

  find(query = {}, options) {
    return ChatModel.findByQuery(query, options);
  }

  findByChatId(_id, options) {
    return ChatModel.findByChatId(_id, options);
  }

  remove(_id) {
    return ChatModel.remove({ _id });
  }

  async update(chatId, modifier) {
    const chat = await ChatModel.updateOne({ _id: chatId }, { $set: { ...modifier } });
    return chat;
  }
}

export default new ChatsService();
