import mongoose from 'mongoose';
import beautifyUnique from 'mongoose-beautiful-unique-validation';

const UserSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      lowercase: true,
      unique: 'A user with the username {VALUE} is already registered',
      index: true,
      required: [true, 'Please enter a username'],
    },
    email: {
      type: String,
      lowercase: true,
      unique: 'A email: {VALUE} is already registered',
      index: true,
      required: [true, 'Please enter a email'],
    },
    password: {
      type: String,
      required: [true, 'Please enter a password'],
    },
    accessTokens: [
      {
        token: String,
        expiresAt: Date,
      },
    ],
    profile: {
      avatar: String,
      firstName: {
        type: String,
        required: [true, 'Please enter first name'],
        index: true,
      },
      lastName: {
        type: String,
        required: [true, 'Please enter last name'],
        index: true,
      },
    },
    lastLoginDate: { type: Date, default: Date.now },
    chatsId: { type: Array, default: [] },
  },
  { timestamps: true },
);

// Beautify unique messages
// ref: https://www.npmjs.com/package/mongoose-beautiful-unique-validation#usage
UserSchema.plugin(beautifyUnique);

UserSchema.statics.findByToken = function findByToken(token) {
  return this.findOne({ 'accessTokens.token': token });
};

UserSchema.statics.findByUsername = function findByUsername(username) {
  return this.findOne({ username });
};

UserSchema.statics.findById = function findUserById(_id) {
  return this.findOne({ _id });
};

const UserModel = mongoose.model('User', UserSchema);

export default UserModel;
