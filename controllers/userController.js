const { User, Thought } = require('../models');

module.exports = {
  getUsers(req, res) {
    User.find().populate('thoughts').lean()
      .then((users) => res.json(users))
      .catch((err) => res.status(500).json(err));
  },

  getOneUser(req, res) {
    User.findOne({ _id: req.params.userId }).populate('thoughts').lean()
      .select('-__v')
      .then((user) => user ? res.json(user) : res.status(404).json({ message: 'Invalid user ID' }))
      .catch((err) => res.status(500).json(err));
  },

  createUser(req, res) {
    User.create(req.body)
      .then((user) => res.json(req.body))
      .catch((err) => res.status(500).json(err));
  },

  updateUser(req, res) {
    User.findOneAndUpdate(
        { _id: req.params.userId },
        { $set: req.body },
        { runValidators: true, new: true }).populate('thoughts').lean()
      .then((user) => user ? res.json(user) : res.status(404).json({ message: 'Invalid user ID' }))
      .catch((err) => res.status(500).json(err));
  },

  deleteUser(req, res) {
    User.findOneAndDelete({ _id: req.params.userId }).lean()
      .then((user) => user 
        ? Thought.deleteMany({ _id: { $in: user.thoughts } }).lean() 
        : res.status(404).json({ message: 'Invalid user ID' }))
      .then(() => res.json({ message: 'User and associated thoughts deleted' }))
      .catch((err) => res.status(500).json(err));
  },

  addFriend(req, res) {
    User.findOne({ _id: req.params.friendId }).lean()
      .then((friend) => friend 
        ? User.findOneAndUpdate(
          { _id: req.params.userId },
          { $addToSet: { friends: req.params.friendId } },
          { new: true }).populate('thoughts').lean()
        : res.status(404).json({ message: 'Invalid friend ID' }))
      .then((user) => user ? res.json(user) : res.status(404).json({ message: 'Invalid user ID' }))
      .catch((err) => res.status(500).json(err));
  },

  removeFriend(req, res) {
    User.findOneAndUpdate(
        { _id: req.params.userId },
        { $pull: { friends: req.params.friendId } },
        { new: true }).populate('thoughts').lean()
      .then((user) => user ? res.json(user) : res.status(404).json({ message: 'Invalid user ID' }))
      .catch((err) => res.status(500).json(err));
  },
};
