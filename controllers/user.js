const Users = require("../models/user");

async function getAllUsers(req, res) {
  const allDbUsers = await Users.find({});
  return res.json(allDbUsers);
}

async function getUserById(req, res) {
  const userData = await Users.findById(req.params.id);
  if (!userData) return res.status(404).json("User Not Found!!");
  return res.json(userData);
}

async function updateUserById(req, res) {
  const body = req?.body || {};
  const userData = Users.findById(req.params.id);
  if (!userData) return res.status(404).json("User Not Found!!");
  await Users.findByIdAndUpdate(req.params.id, { ...userData, ...body });
  return res.json({ status: `Success` });
}

async function deleteUserById(req, res) {
  await Users.findByIdAndDelete(req.params.id);
  return res.json({ status: `Success` });
}

async function addUser(req, res) {
  const body = req?.body || {};
  if (
    !body?.first_name ||
    !body?.last_name ||
    !body?.email ||
    !body?.gender ||
    !body?.job_title
  ) {
    return res.status(404).json({ status: "All Fields are required!!" });
  }

  const result = await Users.create({
    firstName: body?.first_name,
    lastName: body?.last_name,
    email: body?.email,
    gender: body?.gender,
    jobTitle: body?.job_title,
  });

  return res.status(201).json({ msg: "Success", id: result._id });
}

module.exports = {
  getAllUsers,
  getUserById,
  updateUserById,
  deleteUserById,
  addUser,
};
