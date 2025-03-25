const express = require('express');
const app = express();
let jwt = require('jsonwebtoken');

app.use(express.json());

let ADMINS = [];
let USERS = [];
let COURSES = [];

let secretKey = 'anurag';
// function for jwt token generation
function generateJwt(user){
  let payload = {username : user.username};
  let token = jwt.sign(payload, secretKey , { expiresIn: '1h'} )
  return token;
}

let authenticateJwt = (req, res, next) => {
  let authHeader = req.headers.authorization;
  if (authHeader){
    let token = authHeader.split(' ')[1];
    jwt.verify(token, secretKey, (err, user) => {
      if(err){
        return res.sendStatus(404);
      }
      req.user = user;
      next();
    })
  } else {
    res.sendStatus(401);
  }
};

// Admin routes
app.post('/admin/signup', (req, res) => {
  // logic to sign up admin
  let admin = req.body;
  let existingAdmin = ADMINS.find((a) => {a.username == admin.username && a.password == admin.password});
  if(existingAdmin){
    res.send({message: "Admin already existed!"})
  } else {
    let token = generateJwt(admin)
    ADMINS.push(admin);
    res.json({message: "Admin created successfully!", token})
  }
});

app.post('/admin/login', (req, res) => {
  // logic to log in admin
  let {username, password} = req.header;
  let adminExisted = ADMINS.find((a) => a.username == username && a.password == password);
  if(userExisted){
    let token = generateJwt(adminExisted)
    res.json({message : "Admin login successful!"})
  } else {
    res.status(403).json({message: "Admin authentication failed!"})
  }
});

app.post('/admin/courses', (req, res) => {
  // logic to create a course
});

app.put('/admin/courses/:courseId', (req, res) => {
  // logic to edit a course
});

app.get('/admin/courses', (req, res) => {
  // logic to get all courses
});

// User routes
app.post('/users/signup', (req, res) => {
  // logic to sign up user
});

app.post('/users/login', (req, res) => {
  // logic to log in user
});

app.get('/users/courses', (req, res) => {
  // logic to list all courses
});

app.post('/users/courses/:courseId', (req, res) => {
  // logic to purchase a course
});

app.get('/users/purchasedCourses', (req, res) => {
  // logic to view purchased courses
});

app.listen(3000, () => {
  console.log('Server is listening on port 3000');
});
