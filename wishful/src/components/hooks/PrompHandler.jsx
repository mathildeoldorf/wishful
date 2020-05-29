import { useState } from "react";
const usePromptHandler = (initialState) => {
  const [promptMessage, setPromptMessage] = useState(initialState);
  const [promptHeader, setPromptHeader] = useState(initialState);

  const showPromptMessage = (resPromptHeader, resPromptMessage) => {
    console.log(resPromptMessage);
    console.log(resPromptHeader);
    setPromptMessage(resPromptMessage);
    setPromptHeader(resPromptHeader);
  };

  const closePromptMessage = () => {
    setPromptMessage(null);
  };

  return { promptMessage, promptHeader, showPromptMessage, closePromptMessage };
};
export default usePromptHandler;
