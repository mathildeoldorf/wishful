import React, { useState } from "react";
import "./wishlists.css";
import axios from "axios";
const path = require("path");

const UpdateWishlistItem = ({
  wishlistID,
  KeyLink,
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
  console.log(wishlistItem);
  const handleUpdateWishlistItem = async (event) => {
    setLoading(true);
    event.preventDefault();

    console.log(wishlistItem);

    try {
      let linkPreviewResponse = await axios.get(
        `http://api.linkpreview.net/?key=${KeyLink}&q=${link}`,
        {
          withCredentials: false,
        }
      );

      let dataLinkPreview = linkPreviewResponse.data;
      console.log(
        path.join(__dirname, "..", "..", "..", "images", "imageThumbnail.png")
        // "../../../images/imageThumbail.png"
      );

      const image =
        dataLinkPreview.image === ""
          ? (dataLinkPreview.image =
              // "https://dummyimage.com/400x400/494949/f9f9f9.png&text=No+image")
              "/images/imageThumbnail.png")
          : dataLinkPreview.image;
      // path.join(__dirname, "..", "..", "..", "images", "imageThumbnail.png"))

      console.log(image);

      let response = await axios.post(
        // `http://localhost:9090/wishlists/${wishlistID}/item/${wishlistItem.ID}`,
        `http://ec2-54-90-37-154.compute-1.amazonaws.com/wishlists/${wishlistID}/item/${wishlistItem.ID}`,
        {
          title: dataLinkPreview.title,
          description: dataLinkPreview.description,
          price: price,
          link: dataLinkPreview.url,
          image: image,
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
    <section className="updateWishlistItem relative">
      <button
        className="secondary absolute textLeft left"
        type="button"
        onClick={() => setOpen(false)}
      >
        Back
      </button>
      <div className="banner">
        <h2>Almost done...</h2>
        <h1>Simply link the item of your dreams</h1>
      </div>
      <form
        className="grid gridGapSmall gridTwoColumns container"
        onSubmit={handleUpdateWishlistItem}
      >
        <div className="container">
          <div className="container grid">
            <label htmlFor="price">Price</label>
            <input
              onChange={(e) => setPrice(e.target.value)}
              type="text"
              name="price"
              value={price}
              placeholder="Price in DKK"
            />
          </div>
          <div className="container grid">
            <label htmlFor="link">Link</label>
            <input
              onChange={(e) => setLink(e.target.value)}
              type="text"
              name="link"
              value={link}
              placeholder="Link to the item"
            />
          </div>
        </div>
        <div className="relative flexEnd container alignItemsBottom">
          <button
            id={wishlistItem.ID}
            type="submit"
            className="active"
            disabled={!validateForm()}
          >
            {!loading ? "Save item" : "Loading..."}
          </button>
        </div>
      </form>
    </section>
  );
};
export default UpdateWishlistItem;
