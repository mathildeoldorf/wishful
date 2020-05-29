import { useState } from "react";
const useMessageHandler = (initialState) => {
  const [message, setMessage] = useState(initialState);
  const showMessage = (resMessage) => {
    setMessage(resMessage);
    document.querySelector(".message").classList.add("appear");
    setTimeout(() => {
      document.querySelector(".message").classList.remove("appear");
    }, 5000);
  };
  // console.log(message);
  return { message, showMessage };
};
export default useMessageHandler;
