const router = require("express").Router();
const multer = require("multer");
const {
  uploadFileController,
  deleteFileController,
  fetchAllFilesController,
  updateFileController,
  reportGenerateController,
} = require("../controllers/document.controller");
const userAuthMiddleware = require("../middlewares/auth.middleware");

var storage = multer.diskStorage({
  destination: function (request, file, callback) {
    callback(null, "./public/document/");
  },
  filename: function (request, file, callback) {
    callback(null, file.originalname);
  },
});

const upload = multer({ storage: storage });

router.post(
  "/upload",
  upload.single("file"),
  userAuthMiddleware,
  uploadFileController
);

router.get("/list", userAuthMiddleware, fetchAllFilesController);

router.delete("/list/:docId", userAuthMiddleware, deleteFileController);

router.patch("/list/:docId", userAuthMiddleware, updateFileController);

router.post("/report", userAuthMiddleware, reportGenerateController);

module.exports = router;
