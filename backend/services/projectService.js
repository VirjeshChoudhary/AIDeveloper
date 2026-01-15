import mongoose from "mongoose";
import Project from "../models/project.model.js";

export const createProject = async({ name,userId }) => {
    if (!name) {
      throw new Error('Project name is required');
    }
    if (!userId) {
      throw new Error('User ID is required');
    }
  try {
    const project =await Project.create({ name, users: [userId] });
    return project;
  } catch (error) {
    throw error;
  }
};

export const getAllProjectByUserId = async (userId) => {
    if (!userId) {
        throw new Error('User ID is required');
    }
    try {
        const projects = await Project.find({ users: userId });
        return projects;
    } catch (error) {
        console.error('Error fetching projects:', error);
        throw new Error('Internal server error fetching projects');
    }
};

export const addUsersToProject=async({user,projectId,userId})=>{
    if (!user || !projectId || !userId) {
        throw new Error('User, Project ID, and User ID are required');
    }
    if(!mongoose.Types.ObjectId.isValid(projectId)){
      throw new Error("Invalid projectId")
    }
    if(!mongoose.Types.ObjectId.isValid(userId)){
      throw new Error("Invalid userId");
    }
    if(!Array.isArray(user) || user.some(userId=>!mongoose.Types.ObjectId.isValid(userId))){
      throw new Error("Invalid userId(s) in users array")
    }
    // console.log(userId,projectId)
    const project=await Project.findOne({_id:projectId,
      users:userId
    });
    // console.log(project,"VIrjesh");
    if(!project){
      throw new Error("User not belong to this project")
    }
    const updatedProject=await Project.findOneAndUpdate({
      _id:projectId
    },{
      $addToSet:{
        users:{
          $each:user
        }
      }
    },{
      new:true
    }).populate('users')
    return updatedProject;   
}

export const getProjectById=async({projectId})=>{
  if (!projectId) {
        throw new Error("projectId is required")
    }

    if (!mongoose.Types.ObjectId.isValid(projectId)) {
        throw new Error("Invalid projectId")
    }
    const project=await Project.findOne({_id:projectId}).populate("users");
    return project;
}

export const updateFileTree = async ({ projectId, fileTree }) => {
    if (!projectId) {
        throw new Error("projectId is required")
    }

    if (!mongoose.Types.ObjectId.isValid(projectId)) {
        throw new Error("Invalid projectId")
    }

    if (!fileTree) {
        throw new Error("fileTree is required")
    }

    const project = await Project.findOneAndUpdate({
        _id: projectId
    }, {
        fileTree
    }, {
        new: true
    })

    return project;
}