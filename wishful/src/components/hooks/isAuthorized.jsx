import React, { useState, useEffect } from "react";
import axios from "axios";

const isAuthorized = (ComponentToWrap) => (props) => {
  const [auth, setAuth] = useState(false);

  const fetchAuthorization = async () => {
    try {
      const response = await axios.get("http://localhost:9090/user/authorize");
      setAuth(response.data);

      console.log("Authorized " + response.data);
    } catch (error) {
      console.log(error);
    }
  };

  fetchAuthorization();

  return <ComponentToWrap isAuthorized={auth} {...props} />;
};
export default isAuthorized;
