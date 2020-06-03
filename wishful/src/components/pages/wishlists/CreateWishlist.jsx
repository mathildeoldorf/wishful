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
      // let response = await axios.post("http://localhost:9090/wishlists",
      let response = await axios.post(
        "http://ec2-100-25-134-134.compute-1.amazonaws.com/wishlists",
        {
          name: name,
          description: description,
          isPublic: isPublic,
        }
      );

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
    <section className="createWishlist relative">
      <button
        className="secondary absolute textLeft left"
        onClick={() => setUpdate(false)}
      >
        Back
      </button>
      <div className="banner">
        <h2>Here we go...</h2>
        <h1>Let's create a wishlist!</h1>
      </div>
      <form
        className="grid gridGapSmall gridTwoColumns container"
        onSubmit={handleCreateWishlist}
      >
        <div className="container">
          <div className="container grid">
            <label htmlFor="name">Name</label>
            <input
              id="name"
              placeholder="Name"
              type="text"
              onChange={(e) => setName(e.target.value)}
            ></input>
          </div>
          <div className="container grid">
            <label htmlFor="description">Description</label>
            <input
              id="description"
              placeholder="Description"
              type="text"
              onChange={(e) => setDescription(e.target.value)}
            ></input>
          </div>
          <div className="container grid">
            <label className="label" htmlFor="public">
              Do you want your wishlist to be public?
            </label>
            <div className="box">
              <label className="switch">
                <input
                  id="public"
                  defaultChecked
                  type="checkbox"
                  onChange={(e) =>
                    e.target.checked ? setPublic(1) : setPublic(0)
                  }
                />
                <span className="slider round"></span>
              </label>
            </div>
          </div>
        </div>
        <div className="relative flexEnd container alignItemsBottom">
          <button className="active" disabled={!validateForm()} type="submit">
            {loading ? "Loading..." : "Save"}
          </button>
        </div>
      </form>
    </section>
  );
};
export default CreateWishList;
