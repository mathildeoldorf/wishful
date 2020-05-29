import React, { useState } from "react";
import "./wishlists.css";
import axios from "axios";

const CreateWishList = ({ setUpdate, fetchWishlists, showMessage }) => {
  const [loading, setLoading] = useState(false);

  const [name, setName] = useState([]);
  const [description, setDescription] = useState("");
  const [isPublic, setPublic] = useState(1);

  const validateForm = () => {
    return name.length > 0 && description.length > 0;
  };

  const handleCreateWishlist = async (event) => {
    setLoading(true);
    event.preventDefault();
    try {
      let response = await axios.post("http://localhost:9090/wishlists", {
        name: name,
        description: description,
        isPublic: isPublic,
      });

      let data = response.data;

      fetchWishlists();
      setUpdate(false);
      setLoading(false);
      showMessage(data.message);
    } catch (error) {
      setLoading(false);
      // HANDLE ERROR
      showMessage(error.response.data.response);
      console.log(error.response.data.response);
    }
  };

  return (
    <section className="createWishlist">
      <div className="banner">
        <p>Here we go...</p>
        <h1 className="headerSection">Let's create a wishlist!</h1>
      </div>
      <form onSubmit={handleCreateWishlist}>
        <label htmlFor="name">Name</label>
        <input
          id="name"
          placeholder="Name"
          type="text"
          onChange={(e) => setName(e.target.value)}
        ></input>
        <label htmlFor="description">Description</label>
        <input
          id="description"
          placeholder="Description"
          type="text"
          onChange={(e) => setDescription(e.target.value)}
        ></input>
        <div className="box">
          <label className="label" htmlFor="public">
            Public
          </label>
          <label className="switch">
            <input
              id="public"
              defaultChecked
              type="checkbox"
              onChange={(e) => (e.target.checked ? setPublic(1) : setPublic(0))}
            />
            <span className="slider round"></span>
          </label>
        </div>
        <div className="btnContainer">
          <button className="btnBack" onClick={() => setUpdate(false)}>
            Back
          </button>
          <button
            className={validateForm() ? "active" : ""}
            disabled={!validateForm()}
            type="submit"
          >
            {loading ? "Loading..." : "Save"}
          </button>
        </div>
      </form>
    </section>
  );
};
export default CreateWishList;
