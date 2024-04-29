const express = require("express");
const userRouter = require("./routes/user");
const { connectMongoDB } = require("./connection");

const PORT = 8000;

const app = express();

//mongoose connection
connectMongoDB("mongodb://127.0.0.1:27017/project_1")
  .then(() => console.log("MongoDB connected"))
  .catch((e) => console.log("Mongo Error : ", e));

app.use(express.urlencoded({ extended: false }));

app.get("/", (req, res) => {
  res.send("User landed on the home page");
});

app.use("/api/users", userRouter);

app.listen(PORT, () =>
  console.log(
    `Server started at port: ${PORT}\nlive on: http://localhost:${PORT}`
  )
);
