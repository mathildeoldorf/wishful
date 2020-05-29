import React from "react";

import { BounceLoader } from "react-spinners";
import "./utilComponents.css";

const Loader = () => {
  return (
    <div className="Loader-wrapper">
      <BounceLoader color={"white"} className="Loader" />
    </div>
  );
};

export default Loader;
