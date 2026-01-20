const router = require("express").Router();
const authController = require("../controllers/auth.controller");
const { authMiddleware, roleMiddleware } = require("../middleware/auth.middleware");

router.post("/register", authController.register);
router.post("/login", authController.login);
router.post("/refresh", authController.refresh);
router.post("/logout", authController.logout);


router.get(
  "/protected",
  authMiddleware,              // checks valid access token
  roleMiddleware(["admin", "manager", "employee"]), // allowed roles
  (req, res) => {
    res.json({ message: "Access granted to protected route", user: req.user });
  }
);


module.exports = router;
