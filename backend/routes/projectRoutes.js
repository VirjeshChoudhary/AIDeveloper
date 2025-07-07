import { body } from "express-validator";
import express from "express";
import { authUser } from "../middlewares/authMiddleware.js";
import * as projectController from "../controllers/projectController.js";

const router = express.Router();

router.post(
  "/create",
  body("name").isString().withMessage("Project name is required"),
  authUser,
  projectController.createProject
);

router.get("/all", authUser, projectController.getAllProjectByUserId);

router.put(
  "/addusers",
  authUser,
  body("projectId").isString().withMessage("project Id is required"),
  body("users")
    .isArray({ min: 1 })
    .withMessage("Users must be an array of strings")
    .bail()
    .custom((users) => users.every((user) => typeof user === "string"))
    .withMessage("Each user must be string"),
  projectController.addUsersToProject
);

router.get(
  "/get-project/:projectId",
  authUser,
  projectController.projectById
);

router.put('/update-file-tree',
    authUser,
    body('projectId').isString().withMessage('Project ID is required'),
    body('fileTree').isObject().withMessage('File tree is required'),
    projectController.updateFileTree
)

export default router;
