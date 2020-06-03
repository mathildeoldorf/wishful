import React, { useState } from "react";
import { useHistory } from "react-router-dom";
import axios from "axios";

//ERROR HANDLING
import useMessageHandler from "./../../hooks/MessageHandler.jsx";
import Message from "./../../Message.jsx";

const Register = (props) => {
  const emailValidation = /^([a-zA-Z0-9_\-\.]+)@([a-zA-Z0-9_\-\.]+)\.([a-zA-Z]{2,5})$/;
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [repeatPassword, setRepeatPassword] = useState("");

  const [loading, setLoading] = useState(false);
  const { message, showMessage } = useMessageHandler(null);

  const history = useHistory();
  const from = props.location.state || { from: { pathname: "/profile" } };

  const validateForm = () => {
    return (
      firstName &&
      lastName &&
      email.length > 0 &&
      password.length >= 8 &&
      repeatPassword === password &&
      emailValidation.test(email)
    );
  };

  if (localStorage.getItem("user")) {
    history.push("/profile");
  }

  const handleSubmit = async (event) => {
    setLoading(true);
    event.preventDefault();

    try {
      let response = await axios.post(
        // "http://localhost:9090/user/signup"
        "http://ec2-100-25-134-134.compute-1.amazonaws.com/user/signup",
        {
          firstName: firstName,
          lastName: lastName,
          email: email,
          password: password,
          repeatPassword: repeatPassword,
        }
      );

      let data = response.data;
      localStorage.setItem("user", JSON.stringify(data.response));

      //HANDLE AUTH
      props.onAuth(true);

      //HANDLE REDIRECT
      history.push(from.from.pathname);
    } catch (error) {
      //HANDLE LOADING
      setLoading(false);

      // HANDLE ERROR
      showMessage(error.response.data.response);
      console.log(error.response.data.response);
    }
  };

  return (
    <>
      <Message resMessage={message} />
      <section className="signup">
        <div className="banner">
          <h2>Let's get started...</h2>
          <h1 className="headerSection">Sign up</h1>
          <div></div>
        </div>
        <div>
          <form
            className="grid gridGapSmall gridTwoColumns container"
            onSubmit={handleSubmit}
          >
            <div className="container">
              <div className="container grid">
                <label htmlFor="firstName">First Name</label>
                <input
                  id="firstName"
                  placeholder="First Name"
                  type="text"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                ></input>
              </div>
              <div className="container grid">
                <label htmlFor="lastName">Last Name</label>
                <input
                  id="lastName"
                  placeholder="Last Name"
                  type="text"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                ></input>
              </div>
              <div className="container grid">
                <label htmlFor="email">Email</label>
                <input
                  id="email"
                  placeholder="E-mail"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                ></input>
              </div>
              <div className="container grid">
                <label htmlFor="password">Password</label>
                <input
                  id="password"
                  placeholder="Password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                ></input>
              </div>
              <div className="container grid">
                <label htmlFor="Repeat password">Repeat password</label>
                <input
                  id="repeatPassword"
                  placeholder="repeatPassword"
                  type="password"
                  value={repeatPassword}
                  onChange={(e) => setRepeatPassword(e.target.value)}
                ></input>
              </div>
            </div>
            <div className="relative flexEnd container alignItemsBottom">
              <button
                className="active"
                disabled={!validateForm()}
                type="submit"
              >
                {loading ? "Loading" : "Sign up"}
              </button>
            </div>
          </form>
        </div>
      </section>
    </>
  );
};

export default Register;
