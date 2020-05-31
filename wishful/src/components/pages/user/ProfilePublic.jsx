import React, { useState, useEffect } from "react";
import axios from "axios";
import "./user.css";

import Loader from "./../../Loader.jsx";
import Wishlists from "./../wishlists/Wishlists";

//HANDLE MESSAGE
import useMessageHandler from "../../hooks/MessageHandler.jsx";
import Message from "./../../Message.jsx";

const ProfilePublic = (props) => {
  const ID = props.searchID ? props.searchID : props.match.params.ID;

  const [user, setUser] = useState([]);
  console.log(user);
  const [loading, setLoading] = useState(true);
  const { message, showMessage } = useMessageHandler(null);

  const fetchUserProfile = async () => {
    setLoading(true);
    try {
      let response = await axios.get(
        `http://localhost:9090/user/profile/${ID}`
      );
      let data = response.data.response;
      setUser(data);
      setLoading(false);
    } catch (error) {
      setLoading(false);
      showMessage(error.response.data.response);
      console.log(error.response.data.response);
    }
  };

  useEffect(() => {
    fetchUserProfile();
  }, [ID]);

  return (
    <>
      {loading ? <Loader /> : null}
      <div className="profile thumbnail bgPurple">
        <Message resMessage={message} />
        {/* <div className="grid sepContainer"> */}
        <p className="colorWhite"> Profile</p>
        <h1 className="colorWhite">
          {user.firstName} {user.lastName}
        </h1>
        {/* </div> */}
      </div>
      <Wishlists user={user} userID={ID} context="public" />
    </>
  );
};

export default ProfilePublic;
