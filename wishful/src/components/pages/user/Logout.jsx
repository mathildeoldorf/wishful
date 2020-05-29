import React, { useEffect } from "react";
import { useHistory } from "react-router-dom";
import axios from "axios";

const Logout = (props) => {
  const history = useHistory();

  if (localStorage.length === 0) {
    history.push("/");
  }

  useEffect(() => {
    handleUnAuth();
  }, []);

  const handleUnAuth = async () => {
    try {
      let response = await axios.get("http://localhost:9090/user/logout");
      props.onAuth(false);
      localStorage.clear();
      history.push("/");
    } catch (error) {
      if (error) {
        console.log(error.response.data.response);
      }
    }
  };

  return <></>;
};

export default Logout;
