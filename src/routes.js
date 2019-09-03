import { Router } from 'express';
const router = Router();

var idProject = 1;
var idTask = 1;
var projects = [];

function checkProjectExists(req, res, next) {
    const { id } = req.params;
    if (!id) {
        return res.status(400).json({ error: "Id is required" })
    }
    return next();
}

function checkBodyProjectExists(req, res, next) {
    const { title, team } = req.body;
    if (!title) {
        return res.status(400).json({ error: "Title is required" });
    } else if (!team) {
        return res.status(400).json({ error: "Team is required" });
    } else if (!title && !team) {
        return res.status(400).json({ error: "Title and Team is required to request body" })
    }
    return next();
}

function checkBodyTaskExists(req, res, next) {
    const { task, observation } = req.body;
    if (!task) {
        return res.status(400).json({ error: "Task is required" });
    } else if (!observation) {
        return res.status(400).json({ error: "Observation is required" });
    } else if (!task && !observation) {
        return res.status(400).json({ error: "Task and Observation is required to request body" });
    }
    return next();
}

router.get('/projects', (req, res) => {
    return res.json(projects);
})

router.get('/projects/:id', checkProjectExists, (req, res) => {
    const { id } = req.params;
    const project = projects.find(p => p.id == id);
    return res.json(project);
})

router.post('/projects', checkBodyProjectExists, (req, res) => {
    const { title, team } = req.body;
    const project = {
        id: idProject++
        , title
        , team
        , tasks: []
    }
    projects.push(project);
    return res.json({
        "created project": { project }
    })
})

router.put('/projects/:id', checkProjectExists, (req, res) => {
    const { id } = req.params;
    const { title, team } = req.body;
    const project = projects.findIndex(p => p.id == id);
    projects[project].title = title;
    projects[project].team = team;
    return res.json({
        "modificated project": projects[project]
    })
})

router.delete('/projects/:id', checkProjectExists, (req, res) => {
    const { id } = req.params;
    const project = projects.findIndex(p => p.id == id);
    projects.splice(project, 1);
    return res.send();
})

router.post('/projects/:id/tasks', checkBodyTaskExists, checkProjectExists, (req, res) => {
    const { id } = req.params;
    const { task, observation } = req.body;
    const project = projects.find(p => p.id == id);
    project.tasks.push({
        "id": idTask++
        , "task": task
        , "observation": observation
    })
    return res.json(project);
})

export default router;