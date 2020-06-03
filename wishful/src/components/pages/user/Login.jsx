import React, {
  useState, //useContext
} from "react";
import { useHistory } from "react-router-dom";
import axios from "axios";

//HANDLE MESSAGE
import useMessageHandler from "../../hooks/MessageHandler.jsx";
import Message from "./../../Message.jsx";
// import AuthContext from "./../../components/contexts/AuthContext";

const Login = (props) => {
  const emailValidation = /^([a-zA-Z0-9_\-\.]+)@([a-zA-Z0-9_\-\.]+)\.([a-zA-Z]{2,5})$/;

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const { message, showMessage } = useMessageHandler(null);

  const history = useHistory();
  const from = props.location.state || {
    from: {
      pathname: "profile",
    },
  };

  const validateForm = () => {
    return (
      email.length > 0 && password.length >= 8 && emailValidation.test(email)
    );
  };

  if (localStorage.getItem("user")) {
    history.push("/profile");
  }

  const handleAuth = async (event) => {
    event.preventDefault();

    try {
      //HANDLE LOADING
      setLoading(true);

      //HANDLE FETCH DATA
      // let response = await axios.post("http://localhost:9090/user/login",
      let response = await axios.post(
        "http://ec2-100-25-134-134.compute-1.amazonaws.com/user/login",
        {
          email: email,
          password: password,
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
          onSubmit={handleAuth}
        >
          <div className="container">
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
