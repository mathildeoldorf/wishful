const router = require("express").Router();
const bcrypt = require("bcryptjs");
const User = require("../models/User");

const isAuthenticated = require("../isAuthenticated");

const escape = require("escape-html");

const alphaCharacterValidation = /[a-zA-Z -]/;
const alphaNumericCharacterValidation = /[a-zA-Z0-9]/;
const emailValidation = /^([a-zA-Z0-9_\-\.]+)@([a-zA-Z0-9_\-\.]+)\.([a-zA-Z]{2,5})$/;

let saltRounds = 10;

// ###################################### AUTHORIZE ROUTE FOR THE FE

router.get("/user/authorize", async (req, res) => {
  if (!req.session.user || req.session.user.isActive === 0) {
    return res.send(false);
  }

  res.status(200).send(true);
});

// ###################################### SIGNUP

router.post("/user/signup", async (req, res) => {
  if (req.session.user) {
    return res.status(401).send({
      response: "User already has a session",
    });
  }

  let {
    firstName,
    lastName,
    email,
    password,
    repeatPassword
  } = req.body;

  firstName = escape(firstName);
  lastName = escape(lastName);
  email = escape(email);
  password = escape(password);
  repeatPassword = escape(repeatPassword);

  if (!firstName || !lastName || !email || !password || !repeatPassword) {
    return res.status(400).send({
      response: "Please fill out all the required fields",
    });
  }
  if (!password.length >= 8) {
    return res.status(400).send({
      response: "Your password must be at least 8 characters",
    });
  }
  if (password !== repeatPassword) {
    return res.status(400).send({
      response: "The passwords doesn't match",
    });
  }
  if (
    alphaCharacterValidation.test(firstName) === false &&
    alphaCharacterValidation.test(lastName) === false
  ) {
    return res.status(400).send({
      response: "Your name must not contain special characters",
    });
  }
  if (
    alphaNumericCharacterValidation.test(password) === false &&
    alphaNumericCharacterValidation.test(repeatPassword) === false
  ) {
    return res.status(400).send({
      response: "Your password must not contain special characters",
    });
  }
  if (emailValidation.test(email) === false) {
    return res.status(400).send({
      response: "Please enter a valid e-mail",
    });
  }

  try {
    const userReq = await User.query()
      .select()
      .where({
        email: email,
      })
      .limit(1);

    if (userReq[0] && userReq[0].isActive === 1) {
      return res.status(400).send({
        response: "The given email is already registered. Please log in",
      });
    }

    bcrypt.hash(password, saltRounds, async (error, hashedPassword) => {
      if (error) {
        console.log("Error hashing password");
        return res.status(404).send({
          response: "Something went wrong, please try again",
        });
      }

      console.log("Hashed password succesfully", hashedPassword);

      if (userReq[0] && userReq[0].isActive === 0) {
        const updateReq = await User.query()
          .update({
            firstName: firstName,
            lastName: lastName,
            email: email,
            password: hashedPassword,
            isActive: 1,
          })
          .where({
            ID: userReq[0].ID,
          });

        const updatedUser = {
          ID: userReq[0].ID,
          firstName: firstName,
          lastName: lastName,
          email: email
        }

        req.session.user = updatedUser;

        return res.status(200).send({
          response: updatedUser,
          message: "Signup reactivation successful! Let's go to your profile",
        });
      }

      let user = await User.query().insert({
        firstName: firstName,
        lastName: lastName,
        email: email,
        password: hashedPassword,
      });

      delete user.password;

      req.session.user = user;

      return res.status(200).send({
        response: user,
        message: "Signup successful! Let's go to your profile",
      });
    });
  } catch (error) {
    console.log(error);
    return res.status(500).send({
      response: "Something went wrong, please try again",
    });
  }
});

// ###################################### LOGIN

router.post("/user/login", async (req, res) => {
  if (req.session.user) {
    return res.status(401).send({
      response: "User already has a session",
    });
  }

  let {
    email,
    password
  } = req.body;

  email = escape(email);
  password = escape(password);

  if (!email || !password) {
    return res.status(400).send({
      response: "Please fill out all the required fields",
    });
  }
  if (!password.length === 8) {
    return res.status(400).send({
      response: "Your password must be at least 8 characters",
    });
  }
  if (alphaNumericCharacterValidation.test(password) === false) {
    return res.status(400).send({
      response: "Your password must not contain special characters",
    });
  }
  if (emailValidation.test(email) === false) {
    return res.status(400).send({
      response: "Please provide a valid e-mail",
    });
  }

  try {
    let userReq = await User.query()
      .select()
      .where({
        email: email,
      })
      .limit(1);

    if (!userReq[0] || userReq[0].isActive === 0) {
      return res.status(404).send({
        response: "The given email is not registered. Please sign up to proceed",
      });
    }

    bcrypt.compare(password, userReq[0].password, (error, isSame) => {
      if (error) {
        return res.status(500).send({
          response: "Something went wrong hashing password, please try again",
        });
      }
      if (!isSame) {
        return res.status(404).send({
          response: "Your password is incorrect, please try again",
        });
      }

      delete userReq[0].password;
      delete userReq[0].token;
      delete userReq[0].createdAt;
      delete userReq[0].isActive;

      req.session.user = userReq[0];

      return res.status(200).send({
        response: req.session.user,
      });
    });
  } catch (error) {
    return res.status(500).send({
      response: "Something went wrong, please try again",
    });
  }
});

// ###################################### LOGOUT

router.get("/user/logout", (req, res) => {
  // console.log('here');
  // if (!req.session.user) {
  //   return res.status(401).send({
  //     response: "User is logget out",
  //   });
  // }
  req.session.destroy((error) => {
    if (error) {
      return res.status(500).send({
        response: "Error logging out. Please try again.",
      });
    }
    res.status(200).send({
      response: "Log out succesful",
    });
  });
});

// ###################################### PROTECTED PROFILE

router.get("/user/profile", isAuthenticated, async (req, res) => {
  res.status(200).send({
    response: req.session.user,
  });
});

// ###################################### PUBLIC PROFILE

router.get("/user/profile/:ID", async (req, res) => {
  const ID = req.params.ID;

  try {
    let user = await User.query()
      .select()
      .where({
        ID: ID
      })
      .limit(1);

    if (!user[0] || user[0].isActive === 0) {
      return res.status(401).send({
        response: "User not found",
      });
    }

    delete user[0].password;
    delete user[0].token;
    delete user[0].isActive;

    return res.status(200).send({
      response: user[0]
    });

  } catch (error) {
    return res.status(500).send({
      response: "Something went wrong, please try again",
    });
  }
});

// ###################################### UPDATE PROFILE

router.post("/user/profile", isAuthenticated, async (req, res) => {
  let {
    firstName,
    lastName,
    email
  } = req.body;

  const userID = req.session.user.ID;

  try {
    if (req.session.user.firstName !== firstName && firstName) {
      const updateReq = await User.query()
        .update({
          firstName: firstName,
        })
        .where({
          ID: userID,
        });

      req.session.user.firstName = firstName;
    }

    if (req.session.user.lastName !== lastName && lastName) {
      const updateReq = await User.query()
        .update({
          lastName: lastName,
        })
        .where({
          ID: userID,
        });

      req.session.user.lastName = lastName;
    }

    if (req.session.user.email !== email && email) {
      let user = await User.query()
        .select()
        .where({
          email: email,
        })
        .limit(1);

      if (user[0]) {
        return res.status(500).send({
          response: "The given e-mail is already registered.",
        });
      }

      const updateReq = await User.query()
        .update({
          email: email,
        })
        .where({
          ID: userID,
        });

      req.session.user.email = email;

    }

    return res.status(200).send({
      response: "Your information is succesfully updated",
    });
  } catch (error) {
    console.log(error);
    return res.status(500).send({
      response: "Something went wrong, please try again",
    });
  }
});

// ###################################### DELETE PROFILE

router.get("/user/delete", isAuthenticated, async (req, res) => {

  try {
    const deleteReq = await User.query()
      .update({
        isActive: 0,
      })
      .where({
        ID: req.session.user.ID,
      });

    req.session.destroy((error) => {
      if (error) {
        return res.status(500).send({
          response: "Error logging out. Please try again.",
        });
      }
    });

    return res.status(200).send({
      response: "Succesfully deleted",
    });
  } catch (error) {
    console.log(error);
    return res.status(500).send({
      response: "Something went wrong deleting the profile, please try again",
    });
  }
});

// ###################################### GET ALL USERS

router.get("/users", async (req, res) => {

  try {
    let users = await User.query()
      .select()
      .where({
        isActive: 1
      });

    if (!users) {
      return res.status(401).send({
        response: "No users",
      });
    }

    return res.status(200).send({
      response: users
    });

  } catch (error) {
    return res.status(500).send({
      response: "Something went wrong, please try again",
    });
  }
});


// ###################################### SEARCH FOR USERS

// ###################################### SEARCH FOR USERS

router.get("/search", async (req, res) => {
  let term = req.query.term;

  try {
    let users = await User.query()
      .select(
        'ID',
        'firstName',
        'lastName'
      )
      .where(
        'firstName', 'like', `${term}%`
      )
      .orWhere(
        'lastName', 'like', `${term}%`
      )
      .andWhere({
        isActive: 1
      })

    let wishlists = await Wishlist.query().select(
        'ID',
        'name',
        'userID'
      )
      .where(
        'name', 'like', `${term}%`
      )
      .andWhere({
        isActive: 1,
        isPublic: 1
      })

    if (!users[0] && !wishlists[0]) {
      return res.status(404).send({
        response: "No result",
      });
    }

    return res.status(200).send({
      response: {
        "users": users,
        "wishlists": wishlists
      }
    });

  } catch (error) {
    console.log(error);
    return res.status(500).send({
      response: "Something went wrong, please try again",
    });
  }
});

module.exports = router;