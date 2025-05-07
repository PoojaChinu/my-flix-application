const passport = require("passport"),
  LocalStrategy = require("passport-local").Strategy,
  Models = require("./models.js"),
  passportJWT = require("passport-jwt");

// local Strategy

passport.use(
  new LocalStrategy(
    {
      // This tells the password to look for the login form fields
      usernameField: "Username",
      passwordField: "Password",
    },
    // calls the async functiion when user try to attempt the login
    async (username, password, callback) => {
      console.log(`${username} ${password}`);
      await User.findOne({ Username: username })
        .then((user) => {
          if (!user) {
            // if user is not found, authentication failed
            console.log("incorrect username");
            return callback(null, false, {
              message: "Incorrect username or password.",
            });
          }
          console.log("finifshed");
          // if user found, passes the user object indicating successful login
          return callback(null, user);
        })
        .catch((error) => {
          if (error) {
            console.log(error);
            return callback(error);
          }
        });
    }
  )
);

// JWT Strategy

passport.use(
  new JWTStrategy(
    {
      jwtFromRequest: ExtractJWT.fromAuthHeaderAsBearerToken(),
      secretOrKey: "your_jwt_secret",
    },
    async (jwtPayload, callback) => {
      return await Users.findById(jwtPayload._id)
        .then((user) => {
          return callback(null, user);
        })
        .catch((error) => {
          return callback(error);
        });
    }
  )
);
