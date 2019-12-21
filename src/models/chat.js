import mongoose from 'mongoose';

const ChatSchema = new mongoose.Schema(
  {
    productId: {
      type: String,
      required: [true, 'Please enter a productId'],
    },
    product: {
      type: 'ObjectId',
      ref: 'Product'
    },
    interlocutor: {
      type: 'ObjectId',
      ref: 'User'
    },
    creator: {
      type: 'ObjectId',
      ref: 'User'
    },
    createdBy: {
      type: String,
      required: [true, 'Please enter a createdBy'],
    },
    productOwnerId: {
      type: String,
      required: [true, 'Please enter a productOwnerId'],
    },
    messages: [],
    unreadMessagesCount: {
      type: Number,
      default: 0,
    }
  },
  { timestamps: true },
);

ChatSchema.statics.findByChatId = function findChatByChatId(chatId) {
  return this.findOne({ _id: chatId })
    .populate("product")
    .populate("interlocutor")
    .populate("creator");
};
ChatSchema.statics.findChatByProductId = function findChatByChatId(chatId, productId) {
  return this.findOne({ _id: chatId, productId })
    .populate("product")
    .populate("interlocutor")
    .populate("creator");
};

ChatSchema.statics.findByQuery = function findByQuery(query, options) {
  return this.find(query)
    .sort({ createdAt: -1 })
    .skip(options.offset || 0)
    .limit(options.limit || 10)
    .populate("product")
    .populate("interlocutor")
    .populate("creator");
};
ChatSchema.statics.findOneByQuery = function findByQuery(query) {
  return this.findOne(query)
    .populate("product")
    .populate("interlocutor")
    .populate("creator");
};

const ChatModel = mongoose.model('Chat', ChatSchema);

export default ChatModel;
