const { Schema, model } = require('mongoose');
const assignmentSchema = require('./Assignment');

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
    },],
  },
  {
    toJSON: {
      virtuals: true,
    },
  }
);

const Student = model('student', studentSchema);

module.exports = Student;
