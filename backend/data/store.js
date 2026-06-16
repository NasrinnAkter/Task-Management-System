const bcrypt = require("bcryptjs");

const users = [
  {
    id: "1",
    name: "Admin User",
    email: "admin@example.com",
    password: bcrypt.hashSync("admin123", 10),
    role: "admin",
  },
  {
    id: "2",
    name: "Nasrin Akter",
    email: "nasrin@example.com",
    password: bcrypt.hashSync("user123", 10),
    role: "user",
  },
  {
    id: "3",
    name: "Sadia Alam",
    email: "sadia@example.com",
    password: bcrypt.hashSync("user123", 10),
    role: "user",
  },
];

const tasks = [
  {
    id: "t1",
    title: "Setup project repository",
    description: "Initialize Git and push to GitHub",
    status: "completed",
    priority: "high",
    userId: "2",
    createdAt: new Date().toISOString(),
  },
  {
    id: "t2",
    title: "Write API documentation",
    description: "Document all REST endpoints",
    status: "in-progress",
    priority: "medium",
    userId: "2",
    createdAt: new Date().toISOString(),
  },
  {
    id: "t3",
    title: "Design database schema",
    description: "Plan the data models",
    status: "pending",
    priority: "high",
    userId: "3",
    createdAt: new Date().toISOString(),
  },
];

module.exports = { users, tasks };