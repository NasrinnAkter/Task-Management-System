const { v4: uuidv4 } = require("uuid");
const { tasks, users } = require("../data/store");

// GET /api/tasks  — Admin gets all, User gets own
const getTasks = (req, res) => {
  if (req.user.role === "admin") {
    const enriched = tasks.map((t) => {
      const owner = users.find((u) => u.id === t.userId);
      return { ...t, ownerName: owner ? owner.name : "Unknown" };
    });
    return res.json(enriched);
  }
  const myTasks = tasks.filter((t) => t.userId === req.user.id);
  res.json(myTasks);
};

// GET /api/tasks/:id
const getTaskById = (req, res) => {
  const task = tasks.find((t) => t.id === req.params.id);
  if (!task) return res.status(404).json({ message: "Task not found." });

  if (req.user.role !== "admin" && task.userId !== req.user.id)
    return res.status(403).json({ message: "Access denied." });

  res.json(task);
};

// POST /api/tasks
const createTask = (req, res) => {
  const { title, description, priority, userId } = req.body;

  if (!title) return res.status(400).json({ message: "Title is required." });

  // Admin can assign to any user; regular user assigns to themselves
  const assignedUserId =
    req.user.role === "admin" && userId ? userId : req.user.id;

  const newTask = {
    id: uuidv4(),
    title,
    description: description || "",
    status: "pending",
    priority: priority || "medium",
    userId: assignedUserId,
    createdAt: new Date().toISOString(),
  };

  tasks.push(newTask);
  res.status(201).json({ message: "Task created.", task: newTask });
};

// PUT /api/tasks/:id
const updateTask = (req, res) => {
  const task = tasks.find((t) => t.id === req.params.id);
  if (!task) return res.status(404).json({ message: "Task not found." });

  if (req.user.role !== "admin" && task.userId !== req.user.id)
    return res.status(403).json({ message: "Access denied." });

  const { title, description, status, priority } = req.body;

  if (title !== undefined) task.title = title;
  if (description !== undefined) task.description = description;
  if (status !== undefined) task.status = status;
  if (priority !== undefined) task.priority = priority;
  task.updatedAt = new Date().toISOString();

  res.json({ message: "Task updated.", task });
};

// DELETE /api/tasks/:id
const deleteTask = (req, res) => {
  const index = tasks.findIndex((t) => t.id === req.params.id);
  if (index === -1) return res.status(404).json({ message: "Task not found." });

  const task = tasks[index];
  if (req.user.role !== "admin" && task.userId !== req.user.id)
    return res.status(403).json({ message: "Access denied." });

  tasks.splice(index, 1);
  res.json({ message: "Task deleted successfully." });
};

module.exports = { getTasks, getTaskById, createTask, updateTask, deleteTask };