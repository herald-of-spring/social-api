const { User, Thought } = require('../models');

module.exports = {
  getThoughts(req, res) {
    Thought.find().lean()
      .then((thoughts) => res.json(thoughts))
      .catch((err) => res.status(500).json(err));
  },

  getOneThought(req, res) {
    Thought.findOne({ _id: req.params.thoughtId }).lean()
      .select('-__v')
      .then((thought) => thought ? res.json(thought) : res.status(404).json({ message: 'Invalid thought ID' }))
      .catch((err) => res.status(500).json(err));
  },

  createThought(req, res) {
    Thought.create(req.body)
      .then((thought) => {
        return {
          success: User.findOneAndUpdate(
            { _id: req.params.userId },
            { $addToSet: { thoughts: thought._id }},
            { new: true }),
          id: thought._id
        }})
      .then((result) => result.success ? res.json(result.success) : Thought.findOneAndDelete({ _id: result.id }))
      .then(() => res.status(404).json({ message: 'Invalid user ID' }))
      .catch((err) => res.status(500).json(err));
  },

  updateThought(req, res) {
    Thought.findOneAndUpdate(
        { _id: req.params.thoughtId },
        { $set: req.body },
        { new: true }).lean()
      .then((thought) => thought ? res.json(thought) : res.status(404).json({ message: 'Invalid thought ID' }))
      .catch((err) => res.status(500).json(err));
  },

  deleteThought(req, res) {
    Thought.findOneAndDelete({ _id: req.params.thoughtId }).lean()
      .then((thought) => thought 
        ? User.findOneAndUpdate(
          { username: thought.username },
          { $pull: { thoughts: req.params.thoughtId }},
          { new: true }).lean()
        : res.status(404).json({ message: 'Invalid thought ID' }))
      .then(() => res.json({ message: 'Thought deleted' }))
      .catch((err) => res.status(500).json(err));
  },

  addReaction(req, res) {
    Thought.findOneAndUpdate(
        { _id: req.params.thoughtId },
        { $addToSet: { reactions: req.body } },
        { new: true }).lean()
      .then((thought) => thought ? res.json(thought) : res.status(404).json({ message: 'Invalid thought ID' }))
      .catch((err) => res.status(500).json(err));
  },

  removeReaction(req, res) {
    Thought.findOneAndUpdate(
        { _id: req.params.thoughtId },
        { $pull: { reactions: { reactionId: req.params.reactionId } } },
        { new: true }).lean()
      .then((thought) => thought ? res.json(thought) : res.status(404).json({ message: 'Invalid thought ID' }))
      .catch((err) => res.status(500).json(err));
  },
};
