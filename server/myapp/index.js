const express = require("express");
const path = require("path");
const { open } = require("sqlite");
const sqlite3 = require("sqlite3");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const cors = require('cors');

const app = express();
app.use(express.json());
app.use(cors());

const dbPath = path.join(__dirname, "database.db");

let db = null;

const initializeDBAndServer = async () => {
  try {
    db = await open({
      filename: dbPath,
      driver: sqlite3.Database,
    });
    app.listen(3009, () => {
      console.log("Server Running at http://localhost:3009/");
    });
  } catch (e) {
    console.log(`DB Error: ${e.message}`);
    process.exit(1);
  }
};
initializeDBAndServer();

// Admin Register API
app.post("/admin/", async (request, response) => {
  const { username, password, name } = request.body;
  const hashedPassword = await bcrypt.hash(password, 10);
  const selectUserQuery = `
    SELECT 
      * 
    FROM 
      admin 
    WHERE 
      username = '${username}';`;
  const dbUser = await db.get(selectUserQuery);
  if (dbUser === undefined) {
    const createUserQuery = `
     INSERT INTO
      admin (username, password, name)
     VALUES
      (
       '${username}',
       '${hashedPassword}',
       '${name}'
      );`;
    await db.run(createUserQuery);
    response.send("User created successfully");
  } else {
    response.status(400);
    response.send("User already exists");
  }
});

app.post("/admin_login/", async (request, response) => {
    const {username, password} = request.body
    const selectUserQuery = `SELECT * FROM admin WHERE username = '${username}'`;
    const dbUser = await db.get(selectUserQuery);
    if (dbUser === undefined) {
      response.status(400);
      response.send({status_code : 400, error_msg : "Invalid username"});
    } else {
      const isPasswordMatched = await bcrypt.compare(password, dbUser.password);
      if (isPasswordMatched === true) {
        const payload = {
          "username": username,
        };
        const jwt_token = jwt.sign(payload, "MY_SECRET_TOKEN");
        response.send({ jwt_token });
      } else {
        response.status(400);
        response.send({status_code : 400, error_msg : "Invalid Password"});
      }
    }
  });
  