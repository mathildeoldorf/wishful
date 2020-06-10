import React, { useState } from "react";
import { useHistory } from "react-router-dom";
import axios from "axios";

//HANDLE MESSAGE
import useMessageHandler from "../../hooks/MessageHandler.jsx";
import Message from "./../../Message.jsx";

// HANDLE FORM
import FormHandler from "../../hooks/FormHandler";

const Login = (props) => {
  const emailValidation = /^([a-zA-Z0-9_\-\.]+)@([a-zA-Z0-9_\-\.]+)\.([a-zA-Z]{2,5})$/;
  const [loading, setLoading] = useState(false);
  const { message, showMessage } = useMessageHandler(null);

  const history = useHistory();
  const from = props.location.state || {
    from: {
      pathname: "profile",
    },
  };

  const validateForm = () => {
    if (values && values.email && values.password) {
      return values.email && values.password;
    }
  };

  const validateInputs = (values) => {
    let errors = {};
    if (!values.email) errors.email = "Please provide an e-mail";
    if (!emailValidation.test(values.email))
      errors.email = "Please provide a valid e-mail";
    if (!values.password) errors.password = "Please provide a password";
    if (values.password.length < 8 || values.password.length > 20)
      errors.password = "Please provide a password between 8 and 20 characters";
    return errors;
  };

  if (localStorage.getItem("user")) {
    history.push("/profile");
  }

  const handleAuth = async () => {
    try {
      //HANDLE LOADING
      setLoading(true);
      console.log(values);

      //HANDLE FETCH DATA
      let response = await axios.post(
        "http://ec2-100-25-134-134.compute-1.amazonaws.com/user/login",
        // let response = await axios.post(
        //   "http://ec2-100-25-134-134.compute-1.amazonaws.com/user/login",
        {
          email: values.email,
          password: values.password,
        }
      );

      //HANDLE AUTH
      props.onAuth(true);
      console.log("logging in");

      localStorage.setItem("user", JSON.stringify(response.data));
      console.log(JSON.parse(localStorage.user));
      //HANDLE REDIRECT
      history.push(from.from.pathname);
    } catch (error) {
      // HANDLE LOADING
      setLoading(false);

      // HANDLE ERROR
      showMessage(error.response.data.response);
      console.log(error.response.data.response);
    }
  };

  const { values, errors, handleChange, handleSubmit } = FormHandler(
    handleAuth,
    validateInputs
  );

  const handleForgottenPassword = () => {
    console.log("User requested a new password");
    history.push("/requestReset");
  };

  return (
    <>
      <Message resMessage={message} />
      <section className="login">
        <div className="banner">
          <h2>Here we go...</h2>
          <h1>Let's login!</h1>
        </div>
        <form
          className="grid gridGapSmall gridTwoColumns container"
          onSubmit={handleSubmit}
        >
          <div className="container">
            <div className="container grid">
              <label htmlFor="email">Email</label>
              <input
                className={`input ${errors.email && "error"}`}
                id="email"
                name="email"
                placeholder="E-mail"
                type="email"
                value={values.email || ""}
                onChange={handleChange}
                required
              ></input>
              {errors.email && <p className="help">{errors.email}</p>}
            </div>
            <div className="container grid">
              <label htmlFor="password">Password</label>
              <input
                className={`input ${errors.password && "error"}`}
                id="password"
                name="password"
                placeholder="Password"
                type="password"
                value={values.password || ""}
                onChange={handleChange}
                required
              ></input>
              {errors.password && <p className="help">{errors.password}</p>}
            </div>
          </div>
          <div className="relative flexEnd container alignItemsBottom">
            <button className="active" disabled={!validateForm()} type="submit">
              {loading ? "Loading..." : "Login"}
            </button>
            <button
              className="marginTopSmall"
              onClick={handleForgottenPassword}
              type="button"
            >
              Forgotten your password ?
            </button>
          </div>
        </form>
      </section>
    </>
  );
};

export default Login;
