import mongoose from 'mongoose';

const MessageSchema = new mongoose.Schema(
  {
    chatId: {
      type: String,
      required: [true, 'Please enter a chatId'],
    },
    body: {
      type: String,
      required: [true, 'Please enter a body'],
    },
    createdBy: {
      type: String,
      required: [true, 'Please enter a createdBy'],
    },
    creator: {
      type: 'ObjectId',
      ref: 'User',
    },
    createdAt: { type: Date, default: Date.now },
  },
  { timestamps: true },
);

MessageSchema.statics.findByChatId = function findChatByChatId(chatId) {
  return this.findOne({ _id: chatId }).populate('creator');
};

MessageSchema.statics.findByQuery = function findByQuery(query, options) {
  return this.find(query)
    .sort({ createdAt: 1 })
    .skip(options.offset)
    .limit(options.limit || 10)
    .populate('creator');
};

const MessageModel = mongoose.model('Message', MessageSchema);

export default MessageModel;
