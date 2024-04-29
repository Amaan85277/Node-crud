const express = require("express");
const {
  getAllUsers,
  updateUserById,
  getUserById,
  deleteUserById,
  addUser,
} = require("../controllers/user");

const router = express.Router();

router.route("/").get(getAllUsers).post(addUser);

router
  .route("/:id")
  .get(getUserById)
  .patch(updateUserById)
  .delete(deleteUserById);

module.exports = router;
