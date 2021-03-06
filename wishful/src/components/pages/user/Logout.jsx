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
      // await axios.get("http://localhost:9090/user/logout");
      await axios.get(
        "http://ec2-100-25-134-134.compute-1.amazonaws.com/user/logout"
      );
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
