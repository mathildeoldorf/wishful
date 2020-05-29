import React from "react";

const Prompt = ({
  resPromptMessage,
  resPromptHeader,
  cancelAction,
  confirmAction,
  loading,
}) => {
  return (
    <div className="promptContainer">
      <div className="banner">
        <p className="headerPrompt">{resPromptHeader}</p>
        <h2 className="subHeaderPrompt">{resPromptMessage}</h2>
      </div>
      <div className="promptContent">
        <div className="btnContainer">
          <button className="active" onClick={confirmAction}>
            {loading ? "Loading..." : "Confirm"}
          </button>
          <button onClick={cancelAction}>Cancel</button>
        </div>
      </div>
    </div>
  );
};
export default Prompt;
