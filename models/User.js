const { Schema, model } = require('mongoose');

const userSchema = new Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
      trim: true
    },
    email: {
      type: String,
      required: true,
      unique: true,
      validate: {
        validator: (v) => '/^([a-z0-9_\.-]+)@([\da-z\.-]+)\.([a-z\.]{2,6})$/'.test(v)
      }
    },
    thoughts: [{
      type: Schema.Types.ObjectId,
      ref: 'thought',
    }],
    friends: [{
      type: Schema.Types.ObjectId,
      ref: 'user',
    }],
  },
  {
    toJSON: {
      virtuals: true,
    },
  }
);

userSchema.virtual('friendCount').get(() => this.friends.length);

const User = model('user', userSchema);

module.exports = User;
