const router = require("express").Router();

const { updateUserController } = require("../controllers/auth.controller");
const { getUserController } = require("../controllers/user.controller");
const authMiddleware = require("../middlewares/auth.middleware");

router.get("/me", authMiddleware, getUserController);

router.patch("/me", authMiddleware, updateUserController);

module.exports = router;
