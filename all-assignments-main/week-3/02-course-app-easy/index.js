const express = require('express');
const app = express();

app.use(express.json());

let ADMINS = [];
let USERS = [];
let COURSES = [];

function adminAuthentication(){
  let {username, password} = req.header;
  let admin = ADMINS.find((a) => {username == a.username && password == a.password});
  if(admin){
    next()
  } else {
    res.status(403).json({message: "Admin authentication failed!"})
  }
}

function userAuthentication() {
  let {username, password} = req.header;
  let user = USERS.find((u) => {username == u.username && password == u.password});
  if(user){
    req.user = user;
    next()
  } else{
    res.status(403).json({message: "User authentication failed!"})
  }
}

// Admin routes
app.post('/admin/signup', (req, res) => {
  // logic to sign up admin
  let newAdmin = req.body;
  let adminExist = ADMINS.find((admin) => admin.username === newAdmin.username);
  if(adminExist){
    console.log("Admin already exist!")
    res.status(403).json({message:'Admin already existed.' })
  } else {
    ADMINS.push(newAdmin);
    res.json({message:'Admin created successfully.' })
  }
});

app.post('/admin/login', adminAuthentication, (req, res) => {
  // logic to log in admin
  req.json("You're login successfully!");
});

app.post('/admin/courses', adminAuthentication, (req, res) => {
  // logic to create a course
  let newCourse = req.body;
  newCourse.id = Date.now();
  COURSES.push(newCourse); 
  res.json({message: "Course created successfully!", courseID : newCourse.id})
});

app.put('/admin/courses/:courseId', (req, res) => {
  // logic to edit a course
  let courseId = req.params.courseId;
  let course = COURSES.find((course) => {courseId === course.id})
  if(course){
    Object.assign(course, req.body)
    res.json({ message: 'Course updated successfully' });
  } else{
    res.status(404).send({message: "Course not found!"});
  }
});

app.get('/admin/courses', (req, res) => {
  // logic to get all courses
  res.json({ courses: COURSES });
});

// User routes
app.post('/users/signup', (req, res) => {
  // logic to sign up user
  // let newUser = req.body; // this is also right, but we have to add purchasedCourses: [] to newUser that why we use below code.
  let newUser = {...req.body, purchagedCourses: []};
  let userExist = USERS.find((user) => user.username === newUser.username);
  if(!userExist){
    USERS.push(newUser);
    res.json({message: "User created successfuly! "});
  } else{
    res.json("User already existed!");
  }
});

app.post('/users/login', userAuthentication, (req, res) => {
  // logic to log in user
  res.json({message: "You're login successfully!"}); 
});

app.get('/users/courses', (req, res) => {
  // logic to list all courses
  let userPurchasedCourses = [];
  for(i=0; i<COURSES.length; i++){
    if(COURSES[i].published){
      userPurchasedCourses.push(COURSES[i])
    }
  }
  res.json({Courses: userPurchasedCourses})
});

app.post('/users/courses/:courseId', userAuthentication, (req, res) => {
  // logic to purchase a course
  let courseId = Number(req.params.courseId); // take couserID from the url
  const course = COURSES.find(c => c.id === courseId && c.published);
  if (course) {
    req.user.purchasedCourses.push(courseId); // In userAuthentication we stored current user detail in a req object, which is we are using here.
    res.json({ message: 'Course purchased successfully' });
  } else {
    res.status(404).json({ message: 'Course not found or not available' });
  }
});

app.get('/users/purchasedCourses', (req, res) => {
  // logic to view purchased courses
  let purchasedCourseId = req.user.purchagedCourses;
  let purchasedCoursesByUser = [];

  for(let i = 0; i < COURSES.length; i++){
    if(purchasedCourseId.indexOf(COURSES[i].id) !== -1){
      purchasedCoursesByUser.push(COURSES[id]);
    }
  }
  res.send(purchasedCoursesByUser);
});

app.listen(3000, () => {
  console.log('Server is listening on port 3000');
});
