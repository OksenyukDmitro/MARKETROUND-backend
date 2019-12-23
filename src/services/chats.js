/* eslint-disable class-methods-use-this */
import ChatModel from '../models/chat';
import UserModel from './auth';
import MessageModel from '../models/message';

class ChatsService {
  async create({ createdBy, productId, productOwnerId }) {
    const user = await UserModel.findUserById(createdBy);

    const chat = await ChatModel.create({
      createdBy,
      productId,
      product: productId,
      interlocutor: productOwnerId,
      productOwnerId,
      creator: user,
    });
    const interlocutor = await UserModel.findUserById(productOwnerId);

    const { _id } = chat;
    const chatsId = [_id, ...user.chatsId];
    const interlocutorChatsId = [_id, ...interlocutor.chatsId];
    await UserModel.update(createdBy, { chatsId });
    await UserModel.update(productOwnerId, { chatsId: interlocutorChatsId });
    return chat;
  }

  async addMessage({ chatId, body, creator }) {
    const message = await MessageModel.create({ chatId, body, createdBy: creator._id, creator });
    const chat = await this.findByChatId(chatId);
    const messages = [message._id, ...chat.messages];
    this.update(chatId, { messages });
    return message;
  }

  find(query = {}, options) {
    return ChatModel.findByQuery(query, options);
  }

  findOne(query = {}) {
    return ChatModel.findOneByQuery(query);
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
