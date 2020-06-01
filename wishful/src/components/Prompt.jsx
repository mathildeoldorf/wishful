import React from "react";

const Prompt = ({
  resPromptMessage,
  resPromptHeader,
  cancelAction,
  confirmAction,
  loading,
}) => {
  return (
    <div className="bgPrompt">
      <div className="prompt alignItemsCenter">
        <div className="banner">
          <h2>{resPromptHeader}</h2>
          <h1 className="headerPrompt">{resPromptMessage}</h1>
        </div>
        <div className="grid gridTwoColumns alignItemsBottom gridGapSmall">
          <button className="active" onClick={confirmAction}>
            {loading ? "Loading..." : "Confirm"}
          </button>
          <button className="marginTopSmall" onClick={cancelAction}>
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};
export default Prompt;
