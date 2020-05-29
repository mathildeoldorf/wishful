import React, { useState } from "react";
import "./wishlists.css";
import axios from "axios";
import WishlistItem from "./WishlistItem";

const UpdateWishlist = ({
  ID,
  setUpdate,
  fetchWishlist,
  showMessage,
  singleWishlist,
}) => {
  const [loading, setLoading] = useState(false);
  console.log(singleWishlist);

  const [name, setName] = useState(singleWishlist.name);
  const [description, setDescription] = useState(singleWishlist.description);
  const [isPublic, setPublic] = useState(singleWishlist.isPublic);

  const validateForm = () => {
    return name.length > 0 && description.length > 0;
  };

  const handleUpdateWishlist = async (event) => {
    setLoading(true);
    event.preventDefault();
    try {
      let response = await axios.post(`http://localhost:9090/wishlists/${ID}`, {
        name: name,
        description: description,
        isPublic: isPublic,
      });

      let data = response.data;
      console.log(response);

      fetchWishlist();
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
    <>
      <div className="banner">
        <p>Here we go...</p>
        <h1 className="headerSection">
          Let's update your wishlist {singleWishlist.name}!
        </h1>
      </div>
      <form onSubmit={handleUpdateWishlist}>
        <label htmlFor="name">Name</label>
        <input
          id="name"
          placeholder="Name"
          type="text"
          onChange={(e) => setName(e.target.value)}
          value={name}
        ></input>
        <label htmlFor="description">Description</label>
        <input
          id="description"
          placeholder="Description"
          type="text"
          onChange={(e) => setDescription(e.target.value)}
          value={description}
        ></input>
        <div className="box">
          <label className="label" htmlFor="public">
            Public
          </label>
          <label className="switch">
            <input
              id="public"
              type="checkbox"
              onChange={(e) => (e.target.checked ? setPublic(1) : setPublic(0))}
              checked={isPublic ? true : false}
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
    </>
  );
};
export default UpdateWishlist;
