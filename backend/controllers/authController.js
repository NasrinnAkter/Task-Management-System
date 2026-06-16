const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { v4: uuidv4 } = require("uuid");
const { users } = require("../data/store");
const { JWT_SECRET } = require("../middleware/authMiddleware");

// POST /api/auth/login
const login = (req, res) => {
  const { email, password } = req.body;

  if (!email || !password)
    return res.status(400).json({ message: "Email and password are required." });

  const user = users.find((u) => u.email === email);
  if (!user)
    return res.status(401).json({ message: "Invalid email or password." });

  const isMatch = bcrypt.compareSync(password, user.password);
  if (!isMatch)
    return res.status(401).json({ message: "Invalid email or password." });

  const token = jwt.sign(
    { id: user.id, name: user.name, email: user.email, role: user.role },
    JWT_SECRET,
    { expiresIn: "1d" }
  );

  res.json({
    message: "Login successful.",
    token,
    user: { id: user.id, name: user.name, email: user.email, role: user.role },
  });
};

// POST /api/auth/register
const register = (req, res) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password)
    return res.status(400).json({ message: "All fields are required." });

  const exists = users.find((u) => u.email === email);
  if (exists)
    return res.status(409).json({ message: "Email already registered." });

  const hashed = bcrypt.hashSync(password, 10);
  const newUser = {
    id: uuidv4(),
    name,
    email,
    password: hashed,
    role: "user",
  };

  users.push(newUser);

  res.status(201).json({
    message: "User registered successfully.",
    user: { id: newUser.id, name: newUser.name, email: newUser.email, role: newUser.role },
  });
};

// GET /api/auth/me
const getMe = (req, res) => {
  res.json({ user: req.user });
};

module.exports = { login, register, getMe };