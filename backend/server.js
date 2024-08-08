const express = require("express");
const cors = require("cors");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
const db = require("./database");

const app = express();

dotenv.config();
app.use(express.json());
app.use(cors());

let PORT = 3001;

// Register route
app.post("/register", (req, res) => {
  const { username, password } = req.body;
  const hashedPassword = bcrypt.hashSync(password, 8);

  // Insert user into database
  db.run(
    "INSERT INTO users (username, password) VALUES (?, ?)",
    [username, hashedPassword],
    function (err) {
      if (err) {
        return res.status(500).send("Error registering user");
      }
      console.log("User Registered Successfully");
      res.status(201).json({ message: "User registered" });
    }
  );
});

// Login route
app.post("/login", (req, res) => {
  const { username, password } = req.body;

  db.get("SELECT * FROM users WHERE username = ?", [username], (err, user) => {
    if (err) {
      return res.status(500).send("Error retrieving user");
    }
    if (!user) {
      return res.status(404).send("User not found");
    }
    
    const passwordIsValid = bcrypt.compareSync(password, user.password);
    if (!passwordIsValid) {
      return res.status(401).send("Invalid password");
    }

    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, {
      expiresIn: "30d",
    });

    res.status(200).send({ auth: true, token: token });
  });
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
