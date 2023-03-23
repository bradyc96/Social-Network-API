const express = require("express");
const { User } = require("../../models");
const router = express.Router();

// READ all
router.get("/", async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 10;
    const page = parseInt(req.query.page) || 1;
    const skip = (page - 1) * limit;
    const users = await User.find({}).skip(skip).limit(limit);
    const count = await User.countDocuments();
    res.json({
      totalUsers: count,
      currentPage: page,
      totalPages: Math.ceil(count / limit),
      users,
    });
  } catch (err) {
    res.status(500).json({
      msg: "Unable to find records",
      err,
    });
  }
});

// READ one
router.get("/:id", async (req, res) => {
  try {
    const user = await User.findOne({
      _id: req.params.id,
    });
    if (!user) {
      res.status(404).json({
        msg: "Record does not exist",
      });
    } else {
      res.json(user);
    }
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
    const newUser = await User.create({
      username: req.body.username,
      email: req.body.email,
    });
    res.json({
      newUser,
      msg: "File successfully created",
    });
  } catch (err) {
    res.status(500).json({
      msg: "Unable to find records",
      err,
    });
  }
});

// UPDATE
router.put("/:id", async (req, res) => {
  try {
    const userUpdate = await User.findByIdAndUpdate(
      { _id: req.params.id },
      { $set: { username: req.body.username, email: req.body.email } }
    );
    if (!userUpdate) {
      res.status(404).json({
        msg: "Record does not exist",
      });
    } else {
      res.json({
        userUpdate,
        msg: "Record successfully updated",
      });
    }
  } catch (err) {
    res.status(500).json({
      msg: "Unable to find records",
      err,
    });
  }
});

// DELETE
router.delete("/:id", async (req, res) => {
  try {
    const deleteUser = await User.findByIdAndDelete(req.params.id);

    if (!deleteUser) {
      res.status(404).json({
        msg: "Record does not exist",
      });
    } else {
      res.json({
        deleteUser,
        msg: "Record was deleted",
      });
    }
  } catch (err) {
    res.status(500).json({
      msg: "Unable to find records",
      err,
    });
  }
});

// Add a friend to a user
router.post("/:userId/friends/:friendId", async (req, res) => {
  try {
    const newFriend = await User.findOneAndUpdate({ _id: req.params.userId }, { friends: req.params.friendId }); 
    res.status(200).json(newFriend);
  } catch (err) {
      res.status(500).json(err); 
  }
});
// DELETE a friend
router.delete("/:userId/friends/:friendId", async (req, res) => {
  try {
    const deleteFriend = await User.findOneAndUpdate(
      { _id: req.params.userId },
      { $pull: { friends: req.params.friendId } },
      { runValidators: true, new: true }
    );
    if (!deleteFriend) {
      return res.status(404).json({
        msg: "Record does not exist",
      });
    }
    res.json({
      deleteFriend,
      msg: "Record successfully deleted",
    });
  } catch (err) {
    res.status(500).json({
      msg: "Unable to find records",
      err,
    });
  }
});

module.exports = router;