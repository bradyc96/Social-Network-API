const express = require("express");
const { Router } = require("express");
const thoughtRoutes = require("./thoughtController");
const userRoutes = require("./userController");

const router = Router();

router.use("/thoughts", thoughtRoutes).use("/users", userRoutes);

module.exports = router;