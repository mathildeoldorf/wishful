import React, { useState, useEffect } from "react";
import axios from "axios";
import "./user.css";
import { useHistory } from "react-router-dom";
import Loader from "./../../Loader.jsx";
import Wishlists from "./../wishlists/Wishlists";

const ProfilePublic = (props) => {
  const history = useHistory();
  const ID = props.searchID ? props.searchID : props.match.params.ID;

  const [user, setUser] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchUserProfile = async () => {
    setLoading(true);
    try {
      let response = await axios.get(
        // `http://localhost:9090/user/profile/${ID}`
        `http://ec2-54-90-37-154.compute-1.amazonaws.com/user/profile/${ID}`
      );
      let data = response.data.response;
      setUser(data);
      setLoading(false);
    } catch (error) {
      history.push("/");
    }
  };

  useEffect(() => {
    fetchUserProfile();
  }, [ID]);

  return (
    <>
      {loading ? <Loader /> : null}
      <div className="profile thumbnail bgPurple">
        <p className="colorWhite"> Profile</p>
        <h1 className="colorWhite">
          {user.firstName} {user.lastName}
        </h1>
      </div>
      <Wishlists userID={ID} context="public" />
    </>
  );
};

export default ProfilePublic;
