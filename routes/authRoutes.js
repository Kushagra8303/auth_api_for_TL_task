const express = require("express");
const router = express.Router();

const {signup,login, getUsers} = require("../controllers/authController");

// simple middleware for checking required body properties
function requireBody(...props) {
  return (req, res, next) => {
    for (const p of props) {
      if (!req.body || req.body[p] === undefined || req.body[p] === "") {
        return res.status(400).json({ message: `${p} is required` });
      }
    }
    next();
  };
}

router.post("/signup", requireBody("name", "email", "password"), signup);
router.post("/login", requireBody("email", "password"), login);

// admin endpoint to list users (could be protected later)
router.get("/admin/users", getUsers);

module.exports = router;