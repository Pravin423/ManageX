const router = require("express").Router();
const { authMiddleware } = require("../middleware/auth.middleware");
const userController = require("../controllers/user.controller");

router.post("/me", authMiddleware, userController.getMe);

module.exports = router;
