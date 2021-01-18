const { request } = require('express');
const express = require('express');
const cors = require('cors');
const { v4: uuidv4 } = require('uuid');
const { uuid, isUuid } = require('uuidv4');

const app = express();

app.use(cors());
app.use(express.json());

const projects = [];

// Middlewares
function logRequests(request, response, next) {
  const { method, url } = request;

  const logLabel = `[${method.toUpperCase()}] ${url}`;

  console.log(logLabel);

  next(); // Next middleware

  console.timeEnd(logLabel);
}

function validateProjectId(request, response, next) {
  const { id } = request.params;

  if (!isUuid(id)) {
    return response.status(400).json({ error: 'Invalid project ID.' });
  }

  return next();
}

app.use(logRequests);
// Apply the validateProjectId middleware to routes in the following format 
app.use('/projects/:id', validateProjectId);

// List projects
app.get('/projects', (request, response) => {
  const { title } = request.query;

  // Filter projects by the Query Param chosen
  const results = title
    // Check if there's a title filter. If so, returns the results filtered
    ? projects.filter(project => project.title.includes(title))
    // Otherwise, returns them all
    : projects;

  return response.json(results);
});

// Create project
app.post('/projects', (request, response) => {
  const { title, owner } = request.body;

  const project = { id: uuid(), title, owner };

  projects.push(project);

  return response.json(project);
});

// Update project
app.put('/projects/:id', (request, response) => {
  const { id } = request.params;
  const { title, owner } = request.body;

  const projectIndex = projects.findIndex(project => project.id === id);

  if (projectIndex < 0) {
    return response.status(400).json({ error: 'Project not found' });
  }

  const project = {
    id,
    title,
    owner,
  };

  projects[projectIndex] = project;

  return response.json(project);
});

// Delete project
app.delete('/projects/:id', (request, response) => {
  const { id } = request.params;
  
  const projectIndex = projects.findIndex(project => project.id === id);

  if (projectIndex < 0) {
    return response.status(400).json({ error: 'Project not found' });
  }

  projects.splice(projectIndex, 1);

  return response.status(204).send();
});

app.listen(3333, () => {
  console.log('Back-end started :)');
});