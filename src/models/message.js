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


    },
    { timestamps: true },
);

MessageSchema.statics.findByChatId = function findChatByChatId(chatId) {
    return this.findOne({ _id: chatId });
};

MessageSchema.statics.findByQuery = function findByQuery(query, options) {
    return this.find(query)
        .sort({ createdAt: -1 })
        .skip(options.offset)
        .limit(options.limit || 10);
};

 

export default MessageSchema;
