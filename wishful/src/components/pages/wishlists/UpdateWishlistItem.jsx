import React, { useState } from "react";
import "./wishlists.css";
import axios from "axios";

const UpdateWishlistItem = ({
  wishlistID,
  KeyLink,
  ID,
  wishlistItem,
  setOpen,
  fetchWishlist,
  showMessage,
}) => {
  const [loading, setLoading] = useState(false);
  const [price, setPrice] = useState(wishlistItem.price);
  const [link, setLink] = useState(wishlistItem.link);

  const validateForm = () => {
    return link.length > 0 && parseInt(price);
  };

  const handleUpdateWishlistItem = async (event) => {
    setLoading(true);
    event.preventDefault();

    try {
      let linkPreviewResponse = await axios.get(
        `http://api.linkpreview.net/?key=${KeyLink}&q=${link}`,
        {
          withCredentials: false,
        }
      );

      let dataLinkPreview = linkPreviewResponse.data;

      let response = await axios.post(
        `http://localhost:9090/wishlists/${wishlistID}/item/${ID}`,
        {
          title: dataLinkPreview.title,
          description: dataLinkPreview.description,
          price: price,
          link: dataLinkPreview.url,
        }
      );

      let data = response.data;

      console.log(data);

      setLoading(false);
      fetchWishlist();
      setOpen(false);
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
        <p>Almost done...</p>
        <h1 className="headerSection">Simply link the item of your dreams</h1>
      </div>
      <form onSubmit={handleUpdateWishlistItem}>
        <div className="sepContainer">
          <label htmlFor="price"></label>
          <input
            onChange={(e) => setPrice(e.target.value)}
            type="text"
            name="price"
            value={price}
            placeholder="Price in DKK"
          />
          <label htmlFor="link"></label>
          <input
            onChange={(e) => setLink(e.target.value)}
            type="text"
            name="link"
            value={link}
            placeholder="Link to the item"
          />
        </div>
        <div className="grid twoColumnContainer">
          <button onClick={() => setOpen(false)}>Back</button>
          <button
            id={wishlistItem.ID}
            type="submit"
            className={validateForm() ? "active" : ""}
            disabled={!validateForm()}
          >
            {!loading ? "Save item" : "Loading..."}
          </button>
        </div>
      </form>
    </>
  );
};
export default UpdateWishlistItem;
