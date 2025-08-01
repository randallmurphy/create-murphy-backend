#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const projectName = process.argv[2];

if (!projectName) {
  console.log('❌ Please provide a project name:');
  console.log('   npx create-murphy-backend my-api');
  process.exit(1);
}

const projectPath = path.join(process.cwd(), projectName);
fs.mkdirSync(projectPath);
process.chdir(projectPath);

// Init npm
console.log(`🚀 Creating project folder: ${projectName}`);
execSync('npm init -y', { stdio: 'inherit' });

// Install dependencies
console.log('📦 Installing express, morgan, mongoose, dotenv...');
execSync('npm install express morgan mongoose dotenv', { stdio: 'inherit' });

// Install dev dependency
console.log('🛠️ Installing nodemon...');
execSync('npm install --save-dev nodemon', { stdio: 'inherit' });

// Folder structure
const folders = ['routes', 'models', 'controllers', 'utils', 'helpers', 'middlewares'];
folders.forEach(folder => {
  fs.mkdirSync(path.join(projectPath, folder));
});

// Example Files
fs.writeFileSync('./routes/exampleRoute.js', `
const express = require('express');
const router = express.Router();
const { getExample } = require('../controllers/exampleController');

router.get('/', getExample);

module.exports = router;
`);

fs.writeFileSync('./controllers/exampleController.js', `
exports.getExample = (req, res) => {
  res.json({ message: 'Example route is working, G!' });
};
`);

fs.writeFileSync('./models/exampleModel.js', `
const mongoose = require('mongoose');

const ExampleSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  }
});

module.exports = mongoose.model('Example', ExampleSchema);
`);

fs.writeFileSync('./utils/exampleUtil.js', `
exports.sayHello = (name) => {
  return \`Yo \${name}, welcome to the backend game.\`;
};
`);

fs.writeFileSync('./helpers/exampleHelper.js', `
exports.getTime = () => {
  return new Date().toISOString();
};
`);

fs.writeFileSync('./middlewares/exampleMiddleware.js', `
module.exports = (req, res, next) => {
  console.log('🧠 Middleware activated at:', new Date().toISOString());
  next();
};
`);

// app.js
fs.writeFileSync('app.js', `
const express = require('express');
const morgan = require('morgan');
require('dotenv').config();

const app = express();
app.use(express.json());
app.use(morgan('dev'));

// Routes
app.use('/api/example', require('./routes/exampleRoute'));

app.get('/', (req, res) => {
  res.send('💼 Murphy Backend is Live');
});

module.exports = app;
`);

// server.js
fs.writeFileSync('server.js', `
const app = require('./app');
const mongoose = require('mongoose');
require('dotenv').config();

const PORT = process.env.PORT || 3000;
const MONGO_URI = process.env.MONGO_URI;

mongoose.connect(MONGO_URI)
  .then(() => {
    console.log('✅ MongoDB Connected');
    app.listen(PORT, () => {
      console.log(\`🔥 Server running on port \${PORT}\`);
    });
  })
  .catch((err) => {
    console.error('❌ Connection error:', err);
  });
`);

// .env
fs.writeFileSync('.env', `PORT=3000\nMONGO_URI=mongodb://localhost:27017/${projectName}`);

// .gitignore
fs.writeFileSync('.gitignore', `
node_modules
.env
`);

// package.json scripts
const pkgPath = path.join(projectPath, 'package.json');
const pkg = JSON.parse(fs.readFileSync(pkgPath));
pkg.scripts = {
  start: "node server.js",
  dev: "nodemon server.js"
};
fs.writeFileSync(pkgPath, JSON.stringify(pkg, null, 2));

console.log('\n✅ Project ready, G.');
console.log(`👉 cd ${projectName} && npm run dev`);
