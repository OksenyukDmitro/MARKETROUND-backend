import mongoose from 'mongoose';

const ChatSchema = new mongoose.Schema(
    {
        productId: {
            type: String,
            required: [true, 'Please enter a productId'],
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

    },
    { timestamps: true },
);

ChatSchema.statics.findByChatId = function findChatByChatId(chatId) {
    return this.findOne({ _id: chatId });
};
ChatSchema.statics.findChatByProductId = function findChatByChatId(chatId, productId) {
    return this.findOne({ _id: chatId, productId: productId });
};

ChatSchema.statics.findByQuery = function findByQuery(query, options) {

    return this.find(query)
        .sort({ createdAt: -1 })
        .skip(options.offset)
        .limit(options.limit || 10);
};

const ChatModel = mongoose.model('Chat', ChatSchema);

export default ChatModel;
