const usersStorage = require("../storages/usersStorage");

// This just shows the new stuff we're adding to the existing contents
const { body, validationResult } = require("express-validator");

const alphaErr = "must only contain letters.";
const lengthErr = "must be between 1 and 10 characters.";

const validateUser = [
  body("firstName")
    .trim()
    .isAlpha()
    .withMessage(`First name ${alphaErr}`)
    .isLength({ min: 1, max: 10 })
    .withMessage(`First name ${lengthErr}`),
  body("lastName")
    .trim()
    .isAlpha()
    .withMessage(`Last name ${alphaErr}`)
    .isLength({ min: 1, max: 10 })
    .withMessage(`Last name ${lengthErr}`),
  body("email").trim().isEmail().withMessage(`must be email`),
  body("age")
    .optional({ values: "falsy" })
    .isInt({ min: 18, max: 20 })
    .withMessage("must be number between 18 and 20"),
  body("bio")
    .optional({ values: "falsy" })
    .isLength({ min: 1, max: 200 })
    .withMessage("must not exceed 200 characters"),
];

const validateSearch = [
  body("firstName")
    .optional({ values: "falsy" })
    .trim()
    .isAlpha()
    .withMessage(`First name ${alphaErr}`)
    .isLength({ min: 1, max: 10 })
    .withMessage(`First name ${lengthErr}`),
  body("lastName")
    .optional({ values: "falsy" })
    .trim()
    .isAlpha()
    .withMessage(`Last name ${alphaErr}`)
    .isLength({ min: 1, max: 10 })
    .withMessage(`Last name ${lengthErr}`),
  body("email")
    .optional({ values: "falsy" })
    .trim()
    .isEmail()
    .withMessage(`must be email`),
];

exports.usersListGet = (req, res) => {
  res.render("index", {
    title: "Home page",
    usersCount: usersStorage.size(),
  });
};

exports.usersCreateGet = (req, res) => {
  res.render("createUser", {
    title: "Create user",
  });
};

// We can pass an entire array of middleware validations to our controller.
exports.usersCreatePost = [
  validateUser,
  (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).render("createUser", {
        title: "Create user",
        errors: errors.array(),
      });
    }
    const { firstName, lastName, email, age, bio } = req.body;
    usersStorage.addUser({ firstName, lastName, email, age, bio });
    res.redirect("/");
  },
];

exports.usersUpdateGet = (req, res) => {
  const user = usersStorage.getUser(req.params.id);
  res.render("updateUser", {
    title: "Update user",
    user: user,
  });
};

exports.usersUpdatePost = [
  validateUser,
  (req, res) => {
    const user = usersStorage.getUser(req.params.id);
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).render("updateUser", {
        title: "Update user",
        user: user,
        errors: errors.array(),
      });
    }
    const { firstName, lastName, email, age, bio } = req.body;
    usersStorage.updateUser(req.params.id, {
      firstName,
      lastName,
      email,
      age,
      bio,
    });
    res.redirect("/");
  },
];

// Tell the server to delete a matching user, if any. Otherwise, respond with an error.
exports.usersDeletePost = (req, res) => {
  usersStorage.deleteUser(req.params.id);
  res.redirect("/");
};

exports.searchUsersPost = [
  validateSearch,
  (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.render("searchUser", {
        errors: errors.array(),
      });
    }

    let users;

    if (req.body.firstName || req.body.lastName || req.body.email) {
      users = usersStorage.queryUsers({
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        email: req.body.email,
      });
    } else {
      users = usersStorage.getUsers();
    }

    res.render("search", {
      title: "Search list",
      users: users,
    });
  },
];
