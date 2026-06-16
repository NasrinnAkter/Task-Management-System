const { users, tasks } = require("../data/store");

// GET /api/users  — Admin only
const getAllUsers = (req, res) => {
  const safeUsers = users.map(({ password, ...rest }) => rest);
  res.json(safeUsers);
};

// GET /api/users/:id  — Admin only
const getUserById = (req, res) => {
  const user = users.find((u) => u.id === req.params.id);
  if (!user) return res.status(404).json({ message: "User not found." });

  const { password, ...safeUser } = user;
  const userTasks = tasks.filter((t) => t.userId === user.id);

  res.json({ user: safeUser, tasks: userTasks });
};

// DELETE /api/users/:id  — Admin only
const deleteUser = (req, res) => {
  const index = users.findIndex((u) => u.id === req.params.id);
  if (index === -1) return res.status(404).json({ message: "User not found." });

  if (users[index].role === "admin")
    return res.status(400).json({ message: "Cannot delete an admin account." });

  users.splice(index, 1);
  res.json({ message: "User deleted successfully." });
};

module.exports = { getAllUsers, getUserById, deleteUser };