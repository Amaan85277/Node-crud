const express = require("express");
const fs = require("fs");

const PORT = 8000;
const users = require("./MOCK_DATA.json");

const app = express();

//Middleware - kind of like a plug-in
//? to put form data coming from api into the body
app.use(express.urlencoded({ extended: false }));

app.use((req, res, next) => {
  console.log('Middleware called');
  // add something in the user request -> can be accessed through-out the request. 
  // example:
  // req.userName = 'klo';
  next();
})

app.get("/", (req, res) => {
  res.send("User landed on the home page");
});

//doc
app.get("/users", (req, res) => {
 // console.log('userName : ', req.userName); >> getting through the data we set in the Middleware

  const html = `
    <ul>
    ${users
      .map((userData) => `<li key=${userData.id}>${userData.first_name}</li>`)
      .join("")}
    </ul>`;

  res.send(html);
});

//Rest api routes

// 1. get users list
app.get("/api/users", (req, res) => {
  // console.log('userName : ', req.userName); >> getting through the data we set in the Middleware
  return res.json(users);
});

// 2. get user through id
// using dynamic path parameter i.e. (:id)
app.get("/api/users/:id", (req, res) => {
  // console.log('userName : ', req.userName); >> getting through the data we set in the Middleware

  // req.params.id is a string whereas id in the mock data is a integer. Therefore converting it into an integer before using find
  const userId = Number(req.params.id);
  const userData = users.find((user) => user.id === userId);

  if (!userData) return res.status(404).json("User Not Found!!");

  return res.json(userData);
});

//3. post a users data
app.post("/api/users", (req, res) => {
  const userData = {
    first_name: req?.body?.first_name,
    last_name: req?.body?.last_name,
    email: req?.body?.email,
    gender: req?.body?.gender,
    job_title: req?.body?.job_title,
  };

  users.push({ ...userData, id: users.length + 1 });

  fs.writeFile("./MOCK_DATA.json", JSON.stringify(users), (err, data) => {
    if (err) {
      return res.json({ status: "User could not be added :(" });
    }
    return res.json({
      status: `User has been successfully added with id: ${users.length}`,
    });
  });
});

// 4.update a users data by his/her id
app.patch("/api/users/:id", (req, res) => {
  const id = Number(req.params.id);
  const body = req?.body || {};

  const user = users.find((user) => user.id === id);

  const updatedUserData = { ...user, ...body };
  updatedUserData.id = id;

  users[id - 1] = updatedUserData; // not a good way but abhi ke liye ok
  // or we can find the user data, delete it and then append a new user but that is not a patch request

  fs.writeFile("./MOCK_DATA.json", JSON.stringify(users), (err, data) => {
    if (err) {
      return res.json({ status: "error occurred" });
    }
    return res.json({
      status: `Success`,
    });
  });
});

// delete the user
app.delete("/api/users/:id", (req, res) => {
  const userId = Number(req?.params?.id);
  const newUsersList = users.filter((user) => user.id !== userId);

  if (JSON.stringify(newUsersList) === JSON.stringify(users)) {
    // not an efficient method. I know.
    return res.json({ status: "The user does not exist" });
  }

  fs.writeFile(
    "./MOCK_DATA.json",
    JSON.stringify(newUsersList),
    (err, data) => {
      if (err) {
        return res.json({ status: "error occurred" });
      }
      return res.json({ status: "Success" });
    }
  );
});

app.listen(PORT, () =>
  console.log(
    `Server started at port: ${PORT}\nlive on: http://localhost:${PORT}`
  )
);
