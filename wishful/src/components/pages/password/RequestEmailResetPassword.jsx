import React, { useState, useEffect } from "react";
import { useHistory } from "react-router-dom";
import axios from "axios";
//MESSAGE HANDLING
import useMessageHandler from "../../hooks/MessageHandler.jsx";
import Message from "../../Message.jsx";

const RequestEmailResetPassword = (props) => {
  const emailValidation = /^([a-zA-Z0-9_\-\.]+)@([a-zA-Z0-9_\-\.]+)\.([a-zA-Z]{2,5})$/;
  const [email, setEmail] = useState("");
  const [open, setOpen] = useState(true);

  // HANDLE LOADING
  const [loading, setLoading] = useState(false);

  // HANDLE MESSAGE
  const { message, showMessage } = useMessageHandler(null);
  const history = useHistory();
  const from = props.location.state || {
    from: {
      pathname: "profile",
    },
  };

  if (localStorage.getItem("user")) {
    history.push("/profile");
  }

  useEffect(() => {
    showMessage("Please enter your email");
  }, []);

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      //HANDLE LOADING
      setLoading(true);

      // HANDLE FETCH DATA
      let response = await axios.post("http://localhost:9090/requestReset", {
        email: email,
      });
      let data = response.data.response;
      console.log(data);
      setLoading(false);
      showMessage(data);
      setOpen(false);
    } catch (error) {
      // HANDLE LOADING
      setLoading(false);
      // HANDLE ERROR
      showMessage(error.response.data.response);
      console.log(error.response.data.response);
    }
  };

  const validateForm = () => {
    return email.length > 0 && emailValidation.test(email);
  };

  return (
    <section className="forgottenPassword">
      <Message resMessage={message} />
      {open ? (
        <>
          <div className="banner">
            <h1 className="formHeader">Let's reset your password</h1>
          </div>
          <form id="forgottenPassword">
            <label htmlFor="email"> Email </label>
            <input
              id="email"
              placeholder="E-mail"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            ></input>
            <button
              className={validateForm() ? "active" : ""}
              disabled={!validateForm}
              onClick={handleSubmit}
              type="submit"
            >
              {loading ? "Loading..." : "Request new password"}
            </button>
          </form>
        </>
      ) : (
        <>
          <div
            className="banner"
            style={{
              display: "grid",
              alignSelf: "center",
              padding: "10% 10%",
              gridGap: "10%",
            }}
          >
            <h1>We're almost there!</h1>
            <p>Please check your e-mail and follow the link to proceed.</p>
          </div>
        </>
      )}
    </section>
  );
};

export default RequestEmailResetPassword;
