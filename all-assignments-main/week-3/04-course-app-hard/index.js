const express = require('express');
const mongoose = require('mongoose')
const jwt = reqire('jsonwebtoken')
const app = express();

app.use(express.json());

// Defining the schemas for the variable or documents
let adminSchema = {
  username : String,
  password : String
}

let courseSchema = {
  title: String,
  description: String,
  price: String,
  published: Boolean
}

let userSchema = {
  username : String,
  password: String,
  purchasedCourses : [{type: mongoose.Schema.Types.ObjectId , ref: 'course'}]
}

// Declare the models
let Admin = mongoose.model(adminSchema, admin);
let Course = mongoose.model(courseSchema, course)
let User = mongoose.model(userSchema, user)

// Secret key for authentication
const SECRETKey = "aNurAg";

let jwtAuthenticate = (req, res, next) => {
  let authToken = req.headers.authorization;
  let token = authToken.slice(' ')[1];
  let user = jwt.varify(token, SECRETKey, (err, user) => {
    if(err){
      res.json({message: "Error occured!"})
    }
    req.user = user;
    next();
  })
}

// Admin routes
app.post('/admin/signup', (req, res) => {
  let {username, password} = req.body;
  function callback() {
    if(username) {
      res.status(403).json({message: "Admin already registered!"})
    }
    let newAdmin = new Admin({username, password})
    newAdmin.save();
    // Generate the token for this new admin
    let token = jwt.sign(username, SECRETKey, { expireIn : '24h'})
    res.json({message: "Admin successfully registered!" , token})
  }
  Admin.findOne({username}).then(callback);
});



app.post('/admin/login', (req, res) => {
  // logic to log in admin
  let {username, password} = req.header;
  let userExist = Admin.findOne({username, password}).then(callback);
  function callback(){
    if(!userExist){
      res.status(403).json({message: "Login unsuccessful!"})
    } else {
      let token = jwt.sign({username, password, role: 'admin'}, SECRETKey, {isExpired : '24h'} )
      res.json({message: "login successful! " , token})
    }
  }
 
});

app.post('/admin/courses', jwtAuthenticate, (req, res) => {
  // logic to create a course
  let newCourse = new Course(req.body);
  newCourse.save().then(callback);
  function callback(){
    res.json({message: "Course created successfully!", courseId: Course.id} )
  }
});

app.put('/admin/courses/:courseId', (req, res) => {
  // logic to edit a course
  let courseId = req.params.courseId;
  let course = Admin.findByIdAndUpdate(courseId, req.body, {new: true});
  if (course){
    res.json({message: "Course Updated Successfully!"})
  } else{
    res.status(404).json({message: "Course not found!"})
  }
});


app.get('/admin/courses', authenticateJwt, async (req, res) => {
  const courses = await Course.find({});
  res.json({ courses });
});

// User routes
app.post('/users/signup', async (req, res) => {
  const { username, password } = req.body;
  const user = await User.findOne({ username });
  if (user) {
    res.status(403).json({ message: 'User already exists' });
  } else {
    const newUser = new User({ username, password });
    await newUser.save();
    const token = jwt.sign({ username, role: 'user' }, SECRET, { expiresIn: '1h' });
    res.json({ message: 'User created successfully', token });
  }
});

app.post('/users/login', async (req, res) => {
  const { username, password } = req.headers;
  const user = await User.findOne({ username, password });
  if (user) {
    const token = jwt.sign({ username, role: 'user' }, SECRET, { expiresIn: '1h' });
    res.json({ message: 'Logged in successfully', token });
  } else {
    res.status(403).json({ message: 'Invalid username or password' });
  }
});

app.get('/users/courses', authenticateJwt, async (req, res) => {
  const courses = await Course.find({published: true});
  res.json({ courses });
});

app.post('/users/courses/:courseId', authenticateJwt, async (req, res) => {
  const course = await Course.findById(req.params.courseId);
  console.log(course);
  if (course) {
    const user = await User.findOne({ username: req.user.username });
    if (user) {
      user.purchasedCourses.push(course);
      await user.save();
      res.json({ message: 'Course purchased successfully' });
    } else {
      res.status(403).json({ message: 'User not found' });
    }
  } else {
    res.status(404).json({ message: 'Course not found' });
  }
});

app.get('/users/purchasedCourses', authenticateJwt, async (req, res) => {
  const user = await User.findOne({ username: req.user.username }).populate('purchasedCourses');
  if (user) {
    res.json({ purchasedCourses: user.purchasedCourses || [] });
  } else {
    res.status(403).json({ message: 'User not found' });
  }
});

app.listen(3000, () => console.log('Server running on port 3000'));