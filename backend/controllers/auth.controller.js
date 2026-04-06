const pool = require("../config/db");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

class AuthController {
  static async register(req, res) {
    const { username, email, password } = req.body;
    try {
      const hashedPassword = await bcrypt.hash(password, 10);
      const [result] = await pool.query(
        "INSERT INTO users (username, email, password) VALUES (?, ?, ?)",
        [username, email, hashedPassword],
      );
      res.status(201).json({
        message: "User registered successfully",
        userId: result.insertId,
      });
    } catch (error) {
      if (error.code === "ER_DUP_ENTRY") {
        return res
          .status(409)
          .json({ error: "Email hoặc tên người dùng đã tồn tại" });
      }
      res.status(500).json({ error: error.message });
    }
  }

  static async login(req, res) {
    const { email, password } = req.body;
    try {
      const [users] = await pool.query("SELECT * FROM users WHERE email = ?", [
        email,
      ]);
      const user = users[0];

      if (!user || !(await bcrypt.compare(password, user.password))) {
        return res.status(401).json({ error: "Invalid email or password" });
      }

      const token = jwt.sign(
        { id: user.id, role: user.role },
        process.env.JWT_SECRET,
        { expiresIn: "24h" },
      );

      res.json({
        token,
        user: {
          id: user.id,
          username: user.username,
          email: user.email,
          avatar_url: user.avatar_url,
          role: user.role,
        },
      });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  static async updateAvatar(req, res) {
    const userId = req.userId;
    const { avatarUrl } = req.body;

    if (!avatarUrl || typeof avatarUrl !== "string") {
      return res.status(400).json({ error: "avatarUrl không hợp lệ" });
    }

    try {
      await pool.query("UPDATE users SET avatar_url = ? WHERE id = ?", [
        avatarUrl,
        userId,
      ]);

      res.json({
        message: "Avatar updated successfully",
        avatarUrl,
      });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  static async updateUsername(req, res) {
    const userId = req.userId;
    const { username } = req.body;

    if (!username || typeof username !== "string" || username.trim().length === 0) {
      return res.status(400).json({ error: "Username không hợp lệ" });
    }

    if (username.length < 3 || username.length > 50) {
      return res.status(400).json({ error: "Username phải từ 3-50 ký tự" });
    }

    try {
      await pool.query("UPDATE users SET username = ? WHERE id = ?", [
        username.trim(),
        userId,
      ]);

      res.json({
        message: "Username updated successfully",
        username: username.trim(),
      });
    } catch (error) {
      if (error.code === "ER_DUP_ENTRY") {
        return res.status(409).json({ error: "Username đã tồn tại" });
      }
      res.status(500).json({ error: error.message });
    }
  }
}

module.exports = AuthController;
