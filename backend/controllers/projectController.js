import * as projectService from "../services/projectService.js";
import { validationResult } from "express-validator";

// ...existing code...
export const createProject = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  try {
    const { name } = req.body;
    if (!name) {
      return res.status(400).json({ message: 'Project name is required' });
    }
    const userId = req.user._id;
    const project = await projectService.createProject({ name, userId });
    res.status(201).json(project);
  } catch (error) {
    console.error('Error creating project:', error); // For debugging
    // Check both error.code and error.cause?.code for duplicate key error
    if (error.code === 11000 || error.cause?.code === 11000) {
      return res.status(400).json({ message: 'Project name already exists' });
    }
    res.status(500).json({ message: 'Internal server error creating project' });
  }
}
// ...existing code...

export const getAllProjectByUserId = async (req, res) => {
  try {
    const userId = req.user._id;
    // console.log(userId);
    
    if (!userId) {
      return res.status(400).json({ message: 'User ID is required' });
    }
    const projects=await projectService.getAllProjectByUserId(userId);
    return res.status(200).json(projects);
  } catch (error) {
    console.error('Error fetching projects:', error);
    res.status(500).json({ message: 'Internal server error in getAllprojectbyUserId' });
  }
}

export const addUsersToProject=async (req,res) => {
  const errors=validationResult(req);
  if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
  try {
    const {projectId,users}=req.body;
    const userId=req.user._id;
    const project=await projectService.addUsersToProject({user:users,projectId,userId});
    return res.status(200).json({project})
  } catch (error) {
    console.log(error);
    res.status(400).json({error:error.message})
  }
}

export const projectById=async (req,res) => {
  const {projectId}=req.params;
  try {
    const project=await projectService.getProjectById({projectId})
    return res.status(200).json({project})
  } catch (error) {
    console.log(err)
    res.status(400).json({ error: err.message })
  }
}

export const updateFileTree = async (req, res) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    try {

        const { projectId, fileTree } = req.body;

        const project = await projectService.updateFileTree({
            projectId,
            fileTree
        })

        return res.status(200).json({
            project
        })

    } catch (err) {
        console.log(err)
        res.status(400).json({ error: err.message })
    }
}


