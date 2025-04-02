const express = require("express");
const dotenv = require("dotenv");
const session = require("express-session");
const passport = require("passport");
const cors = require("cors");
const connect = require("./db/connection");
const authRouter = require("./routes/auth.router");
const blogRouter = require("./routes/blogs.router");
const commentRouter = require("./routes/comment.router");

// env config
dotenv.config(); 

// passport config
require("./utils/passport")(passport);

// db connect 
connect(); 

const app = express(); 
const port = process.env.PORT || 5050; 

// Enable CORS
app.use(cors({
    origin: true, // Allow all origins
    credentials: true // Allow credentials
}));

app.use(session({
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: false,
}));

// passport middleware
app.use(passport.initialize());
app.use(passport.session()); 

app.use(express.json());

// Routes 
app.get("/", (req, res) => {
    return res.json({
        message: "Hello from server"
    })
})

app.use("/auth", authRouter);
app.use("/blog", blogRouter);
app.use("/comment", commentRouter);

app.listen(port, () => {
    console.log(`process is running on port: ${port}`);
})