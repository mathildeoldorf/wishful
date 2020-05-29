import React, { useState, useEffect } from "react";
import axios from "axios";
import "./user.css";
import { useHistory } from "react-router-dom";

import Loader from "./../../Loader.jsx";

//HANDLE MESSAGE
import useMessageHandler from "../../hooks/MessageHandler.jsx";
import Message from "./../../Message.jsx";

// HANDLE PROMPT
import usePromptHandler from "./../../hooks/PrompHandler";
import Prompt from "./../../Prompt";

const Profile = (props) => {
  const history = useHistory();

  const emailValidation = /^([a-zA-Z0-9_\-\.]+)@([a-zA-Z0-9_\-\.]+)\.([a-zA-Z]{2,5})$/;

  const [user, setUser] = useState([]);
  const [email, setEmail] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [update, setUpdate] = useState(false);
  const [open, setOpen] = useState(false);

  const [loading, setLoading] = useState(true);
  const { message, showMessage } = useMessageHandler(null);
  const {
    promptMessage,
    promptHeader,
    showPromptMessage,
    closePromptMessage,
  } = usePromptHandler(null);

  const fetchUser = async () => {
    setLoading(true);
    try {
      let response = await axios.get("http://localhost:9090/user/profile");
      let data = response.data.response;
      setUser(data);
      setEmail(data.email);
      setFirstName(data.firstName);
      setLastName(data.lastName);

      setTimeout(() => {
        setLoading(false);
      }, 100);
    } catch (error) {
      setLoading(false);

      // HANDLE ERROR
      showMessage(error.response.data.response);
      console.log(error.response.data.response);
    }
  };

  const validateForm = () => {
    if (email) {
      return emailValidation.test(email);
    } else if (!email && !firstName && !lastName) {
      return false;
    }
    return true;
  };

  const deleteProfile = async () => {
    setLoading(true);
    try {
      let response = await axios.get("http://localhost:9090/user/delete");
      // HANDLE AUTH
      props.onUnAuth(false);
      history.push("/");
      setLoading(false);
    } catch (error) {
      setLoading(false);
      // HANDLE ERROR
      showMessage(error);
      console.log(error);
    }
  };

  const updateProfile = () => {
    setUpdate(true);
  };

  const confirmUpdate = async (event) => {
    setLoading(true);
    event.preventDefault();

    try {
      let response = await axios.post("http://localhost:9090/user/profile", {
        email: email,
        firstName: firstName,
        lastName: lastName,
      });
      console.log(response);
      let data = response.data;
      console.log(data);

      fetchUser();
      setLoading(false);
      setUpdate(false);
      showMessage(data.response);
    } catch (error) {
      setLoading(false);
      showMessage(error.response.data.response);
      console.log(error.response.data.response);
    }
  };

  useEffect(() => {
    fetchUser();
  }, []);

  return (
    <>
      {loading ? <Loader /> : null}
      <Message resMessage={message} />
      {promptMessage ? (
        <Prompt
          resPromptMessage={promptMessage}
          resPromptHeader={promptHeader}
          cancelAction={closePromptMessage}
          confirmAction={deleteProfile}
          loading={loading}
        />
      ) : null}
      {update === false ? (
        <section className="profile">
          {/* {loading ? <Loader /> : null} */}
          <div className="banner">
            <h1 className="headerSection">Welcome to Wishful</h1>
            <p> {user.firstName}</p>
          </div>
          <div className="grid twoColumnContainer">
            <div className="grid sepContainer profileDetails">
              <h2>Your information</h2>
              <div className="grid sepContainer">
                <label htmlFor="firstName">First name</label>
                <p className="name">{firstName ? firstName : user.firstName}</p>
              </div>
              <div className="grid sepContainer">
                <label htmlFor="lastName">Last name</label>
                <p className="name">{lastName ? lastName : user.lastName}</p>
              </div>
              <div className="grid sepContainer">
                <label htmlFor="email">Email</label>
                <p className="name">{email ? email : user.email}</p>
              </div>
            </div>
            <div className="btnContainer">
              <h2>Menu</h2>
              <button
                onClick={() => history.push("/wishlists")}
                className="active"
              >
                Your wishlists
              </button>
              <button onClick={updateProfile} className="updateProfile">
                Update profile
              </button>
              <button
                // HANDLE PROMPT
                onClick={() =>
                  showPromptMessage(
                    "Wait...",
                    "Are you sure you want to delete your profile?"
                  )
                }
                className="deleteProfile"
              >
                Delete profile
              </button>
            </div>
          </div>
        </section>
      ) : (
        <section className="profile update">
          <div className="banner">
            <h1>Let's update your information</h1>
            <p>What do you wanna change?</p>
          </div>
          <div className="formContainer">
            <form onSubmit={confirmUpdate}>
              <label htmlFor="firstName">First name</label>
              <input
                className="firstName"
                id="firstName"
                placeholder="First name"
                value={firstName}
                type="text"
                onChange={(e) => setFirstName(e.target.value)}
              ></input>
              <label htmlFor="lastName">Last name</label>
              <input
                className="lastName"
                id="lastName"
                placeholder="Last name"
                value={lastName}
                type="text"
                onChange={(e) => setLastName(e.target.value)}
              ></input>
              <label htmlFor="email">Email</label>
              <input
                className="email"
                id="email"
                placeholder="E-mail"
                value={email}
                type="email"
                onChange={(e) => setEmail(e.target.value)}
              ></input>
              <div className="btnContainer grid twoColumnGrid">
                <button onClick={() => setUpdate(false)}>Cancel</button>
                <button
                  className={validateForm() ? "active" : ""}
                  disabled={!validateForm()}
                  type="submit"
                >
                  {loading ? "Loading..." : "Save"}
                </button>
              </div>
            </form>
          </div>
        </section>
      )}
    </>
  );
};

export default Profile;
