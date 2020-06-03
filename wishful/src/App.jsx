import React, { useState, useEffect } from "react";
import "./App.css";
import "./components/utilComponents.css";
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link,
  NavLink,
  Redirect,
  HashRouter,
} from "react-router-dom";

import Home from "./components/pages/home/Home.jsx";
import Login from "./components/pages/user/Login.jsx";
import Profile from "./components/pages/user/Profile.jsx";
import ProfilePublic from "./components/pages/user/ProfilePublic.jsx";
import Logout from "./components/pages/user/Logout.jsx";
import Reset from "./components/pages/password/ResetPassword.jsx";
import RequestEmail from "./components/pages/password/RequestEmailResetPassword.jsx";
import Register from "./components/pages/user/Signup.jsx";
import Wishlists from "./components/pages/wishlists/Wishlists.jsx";
import Search from "./components/Search.jsx";

import axios from "axios";
import SingleWishlist from "./components/pages/wishlists/SingleWishlist";
axios.defaults.withCredentials = true; //makes sure the cookies are the same for all routes

const AuthenticatedRoute = ({ component: Component, auth, ...rest }) => {
  // Component = Recieved as a prop, and it will be the protected route's component

  return (
    <Route
      {...rest}
      render={(props) =>
        auth === true || localStorage.getItem("user") ? (
          <Component {...props} />
        ) : (
          <Redirect
            to={{
              pathname: "/login",
              state: {
                from: props.location,
              },
            }}
          />
        )
      }
    />
  );
};

const App = (props) => {
  const [auth, setAuth] = useState(localStorage.getItem("user") ? true : false);

  const fetchAuthorization = async () => {
    try {
      // const response = await axios.get("http://localhost:9090/user/authorize");
      const response = await axios.get(
        "http://ec2-54-90-37-154.compute-1.amazonaws.com/user/authorize"
      );
      setAuth(response.data);
    } catch (error) {
      setAuth(false);
    }
  };

  const handleAuth = (data) => {
    setAuth(data);
  };

  const handleUnAuth = () => {
    setAuth(false);
  };

  const [searchID, setSearchID] = useState(false);

  console.log(searchID);

  useEffect(() => {
    console.log("Mounting and fecthing auth - currently auth is " + auth);
    fetchAuthorization();
    return () => console.log("Unmounting...");
  }, [auth]);

  return (
    <HashRouter basename={"/"}>
      <div className="App">
        <nav className="Navigation">
          <ul
            style={
              auth
                ? { gridTemplateColumns: "repeat(5, 1fr)" }
                : { gridTemplateColumns: "repeat(4, 1fr)" }
            }
          >
            <header>
              <Link to={`${process.env.PUBLIC_URL}/`}>Wishful</Link>
            </header>
            {auth ? (
              <React.Fragment>
                <li>
                  <NavLink
                    activeClassName="active"
                    to={`${process.env.PUBLIC_URL}/`}
                    exact
                  >
                    Home
                  </NavLink>
                </li>
                <li>
                  <NavLink
                    activeClassName="active"
                    to={`${process.env.PUBLIC_URL}/wishlists`}
                  >
                    Your wishlists
                  </NavLink>
                </li>
                <li>
                  <NavLink
                    activeClassName="active"
                    to={`${process.env.PUBLIC_URL}/profile`}
                  >
                    Profile
                  </NavLink>
                </li>
                <li>
                  <NavLink
                    activeClassName="active"
                    to={`${process.env.PUBLIC_URL}/logout`}
                  >
                    Log out
                  </NavLink>
                </li>
              </React.Fragment>
            ) : (
              <React.Fragment>
                <li>
                  <NavLink
                    activeClassName="active"
                    to={`${process.env.PUBLIC_URL}/`}
                    exact
                  >
                    Home
                  </NavLink>
                </li>
                <li>
                  <NavLink
                    activeClassName="active"
                    to={`${process.env.PUBLIC_URL}/login`}
                  >
                    Login
                  </NavLink>
                </li>
                <li>
                  <NavLink
                    activeClassName="active"
                    to={`${process.env.PUBLIC_URL}/signup`}
                  >
                    Sign up
                  </NavLink>
                </li>
              </React.Fragment>
            )}
          </ul>
        </nav>

        <main className={auth === false ? "public" : ""}>
          <Switch>
            <Route
              exact
              path={`${process.env.PUBLIC_URL}/`}
              component={(props) => <Home {...props} auth={auth} />}
            />

            <AuthenticatedRoute
              exact
              auth={auth}
              path={`${process.env.PUBLIC_URL}/wishlists`}
              component={(props) => <Wishlists {...props} />}
            />
            <AuthenticatedRoute
              exact
              path={`${process.env.PUBLIC_URL}/wishlists/wishlist/:wishlistID`}
              component={(props) => <SingleWishlist {...props} />}
            />
            <Route
              exact
              path={`${process.env.PUBLIC_URL}/profile/:ID/wishlist/:wishlistID`}
              component={(props) => (
                <SingleWishlist searchID={searchID} {...props} />
              )}
            />
            <AuthenticatedRoute
              exact
              auth={auth}
              path={`${process.env.PUBLIC_URL}/profile`}
              component={(props) => (
                <Profile onUnAuth={handleUnAuth} {...props} />
              )}
            />
            <Route
              exact
              path={`${process.env.PUBLIC_URL}/login`}
              component={(props) => (
                <Login auth={auth} onAuth={handleAuth} {...props} />
              )}
            />
            <Route
              exact
              path={`${process.env.PUBLIC_URL}/signup`}
              component={(props) => <Register onAuth={handleAuth} {...props} />}
            />
            <Route
              exact
              path={`${process.env.PUBLIC_URL}/profile/:ID`}
              component={(props) => (
                <ProfilePublic searchID={searchID} {...props} />
              )}
            />
            <Route
              exact
              path={`${process.env.PUBLIC_URL}/logout`}
              component={(props) => <Logout onAuth={handleUnAuth} {...props} />}
            />
            <Route
              exact
              path={`${process.env.PUBLIC_URL}/confirmReset/:token`}
              component={(props) => <Reset {...props} />}
            />
            <Route
              exact
              path={`${process.env.PUBLIC_URL}/requestReset`}
              component={(props) => <RequestEmail {...props} />}
            />
          </Switch>
          <Search setSearchID={(data) => setSearchID(data)} />
          <div className="colorBlockContainer grid">
            <div className="colorBlock bgGreen"></div>
            <div className="colorBlock grid gridTwoColumns">
              <div className="bgPurple"></div>
              <div className="bgBlue"></div>
            </div>
          </div>
        </main>
        <footer></footer>
      </div>
    </HashRouter>
  );
};

export default App;
