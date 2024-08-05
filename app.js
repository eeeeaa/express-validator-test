const express = require("express");
const app = express();
const path = require("node:path");
const usersRouter = require("./routes/users");

//setup static assets
const assetsPath = path.join(__dirname, "public");
app.use(express.static(assetsPath));

//setup view engines
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

app.use(express.urlencoded({ extended: true }));
app.use("/", usersRouter);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Express app listening on port ${PORT}!`));
