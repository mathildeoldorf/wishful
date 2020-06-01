import React, { useState } from "react";
import "./wishlists.css";
import axios from "axios";

const UpdateWishlist = ({
  setUpdate,
  fetchWishlist,
  showMessage,
  singleWishlist,
}) => {
  const [loading, setLoading] = useState(false);
  const letter = singleWishlist.name.charAt(0);

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
      let response = await axios.post(
        // `http://localhost:9090/wishlists/${singleWishlist.ID}`,
        `http://ec2-54-90-37-154.compute-1.amazonaws.com/wishlists/${singleWishlist.ID}`,
        {
          name: name,
          description: description,
          isPublic: isPublic,
        }
      );

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
    <section className="updateWishlist relative">
      <button
        className="secondary absolute textLeft left"
        onClick={() => setUpdate(false)}
      >
        Back
      </button>
      <div className="coverletter">{letter}</div>
      <div className="banner">
        <h2>Here we go...</h2>
        <h1>Let's update your wishlist</h1>
        <h3>{singleWishlist.name}</h3>
      </div>
      <form
        className="grid gridGapSmall gridTwoColumns container"
        onSubmit={handleUpdateWishlist}
      >
        <div className="container">
          <div className="container grid">
            <label htmlFor="name">Name</label>
            <input
              id="name"
              placeholder="Name"
              type="text"
              onChange={(e) => setName(e.target.value)}
              value={name}
            ></input>
          </div>
          <div className="container grid">
            <label htmlFor="description">Description</label>
            <input
              id="description"
              placeholder="Description"
              type="text"
              onChange={(e) => setDescription(e.target.value)}
              value={description}
            ></input>
          </div>
          <div className="container grid">
            <label className="label" htmlFor="public">
              Public
            </label>
            <div className="box">
              <label className="switch">
                <input
                  id="public"
                  type="checkbox"
                  onChange={(e) =>
                    e.target.checked ? setPublic(1) : setPublic(0)
                  }
                  checked={isPublic ? true : false}
                />
                <span className="slider round"></span>
              </label>
            </div>
          </div>
        </div>
        <div className="relative flexEnd container alignItemsBottom">
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
export default UpdateWishlist;
