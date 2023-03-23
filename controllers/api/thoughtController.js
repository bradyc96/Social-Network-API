const express = require("express");
const { User, Thought } = require("../../models");
const router = express.Router();

// READ All
router.get("/", async (req, res) => {
  try {
    const foundThoughts = await Thought.find();
    res.json(foundThoughts);
  } catch (err) {
    res.status(500).json({
      msg: "Server Error: Unable to get records",
      err,
    });
  }
});

// READ one
router.get("/:id", async ({ params: { id } }, res) => {
  try {
    const thought = await Thought.findById(id);
    if (!thought) {
      return res.status(404).json({
        msg: "Record does not exist",
        err,
      });
    }
    res.json(thought);
  } catch (err) {
    res.status(500).json({
      msg: "Unable to find records",
      err,
    });
  }
});

// CREATE
router.post("/", async (req, res) => {
  try {
    const newThought = await Thought.create({
      thoughtText: req.body.thoughtText,
      username: req.body.username,
    });
    if (newThought) {
      const username = await User.findOne({
        username: req.body.username,
      });
      if (!username) {
        return res
          .status(404)
          .json({ msg: "Record does not exist", err });
      }
      let userThoughtArr = username.thoughts;
      userThoughtArr.push(newThought);
      res.json({ username, msg: "Record successfully created" });
    }
  } catch (err) {
    res.status(500).json({ msg: "an error occurred", err });
  }
});

// UPDATE
router.put("/:id", async (req, res) => {
  try {
    const thoughtUpdate = await Thought.findByIdAndUpdate(
      { _id: req.params.id },
      {
        $set: {
          thoughtText: req.body.thoughtText,
          new: false,
        },
      }
    );
    if (!thoughtUpdate) {
      return res.status(404).json({
        msg: "Record does not exist",
      });
    }
    res.json({ thoughtUpdate, msg: "Record was updated" });
  } catch (err) {
    res.status(500).json({
      msg: "Unable to find records",
      err,
    });
  }
});

// DELETE
router.delete("/:id", async ({ params: { id } }, res) => {
  try {
    const deleteThought = await Thought.findByIdAndDelete(id);
    if (!deleteThought) {
      return res.status(404).json({
        msg: "Record does not exist",
      });
    }
    res.json({ deleteThought, msg: "Record was deleted" });
  } catch (err) {
    res.status(500).json({
      msg: "Unable to find records",
      err,
    });
  }
});

// POST a reaction
router.post("/:thoughtId/reactions", async (req, res) => {
  try {
    const newReaction = await Thought.findOneAndUpdate({ _id: req.params.thoughtId }, { reactions: { reactionBody: req.body.reactionBody }});
    res.status(200).json(newReaction);
  } catch (err) {
      res.status(500).json(err);
  }
});


// DELETE a reaction
router.delete("/:thoughtId/reactions/:reactionId", async (req, res) => {
  try {
    const deleteReaction = await Thought.findOneAndUpdate({ _id: req.params.thoughtId }, { $pull: { reactions: { _id: req.params.reactionId } } }, { new: true });
    res.status(200).json(deleteReaction);
} catch (err) {
    res.status(500).json(err);
}
});


module.exports = router;