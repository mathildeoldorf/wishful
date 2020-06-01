import React, { useState, useEffect } from "react";
import "./home.css";
import axios from "axios";
import { useHistory } from "react-router-dom";
import Loader from "./../../Loader.jsx";
const Home = ({ auth }) => {
  const history = useHistory();
  const [user, setUser] = useState("");
  const [loading, setLoading] = useState("");

  const fetchUser = async () => {
    try {
      // let response = await axios.get("http://localhost:9090/user/profile");
      let response = await axios.get(
        "http://ec2-54-90-37-154.compute-1.amazonaws.com/user/profile"
      );
      let data = response.data.response;
      setUser(data);
      setTimeout(() => {
        setLoading(false);
      }, 100);
    } catch (error) {
      setLoading(false);
      console.log(error.response.data.response);
    }
  };

  useEffect(() => {
    if (auth) {
      console.log(auth);
      fetchUser();
    }
  }, []);

  return (
    <section className="home">
      {loading ? <Loader /> : null}
      {auth ? (
        <>
          <h2>Welcome back to</h2>
          <h1>Wishful, {user ? user.firstName : null}</h1>
          <div className="grid gridTwoColumns gridGapSmall container">
            <button className="active" onClick={() => history.push("/profile")}>
              Go to your profile
            </button>
          </div>
        </>
      ) : (
        <>
          <h2>Welcome to</h2>
          <h1>Wishful</h1>
          <div className="grid gridTwoColumns gridGapSmall container">
            <button className="active" onClick={() => history.push("/signup")}>
              Signup with email
            </button>
            <button onClick={() => history.push("/login")}>
              Login to my account
            </button>
          </div>
        </>
      )}
    </section>
  );
};

export default Home;
