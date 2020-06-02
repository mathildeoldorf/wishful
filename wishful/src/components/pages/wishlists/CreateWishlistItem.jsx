import React, { useState } from "react";
import "./wishlists.css";
import axios from "axios";

const CreateWishlistItem = ({
  wishlistID,
  KeyLink,
  setOpen,
  fetchWishlist,
  showMessage,
}) => {
  const [loading, setLoading] = useState(false);
  const [price, setPrice] = useState(0);
  const [link, setLink] = useState([]);

  const validateForm = () => {
    return link.length > 0 && parseInt(price);
  };

  const createWishlistItem = async (event) => {
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

      const image =
        dataLinkPreview.image === ""
          ? (dataLinkPreview.image =
              // "https://dummyimage.com/400x400/494949/f9f9f9.png&text=No+image"
              "/images/imageThumbnail.png")
          : dataLinkPreview.image;

      console.log(image);

      let response = await axios.post(
        // `http://localhost:9090/wishlists/${wishlistID}/item`,
        `http://ec2-54-90-37-154.compute-1.amazonaws.com/wishlists/${wishlistID}/item`,
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
    <section className="createWishlistItem relative">
      <button
        className="secondary absolute textLeft left"
        type="button"
        onClick={() => setOpen(false)}
      >
        Back
      </button>
      <div className="banner">
        <h2>Almost done...</h2>
        <h1 className="headerSection">Simply link the item of your dreams</h1>
      </div>
      <form
        className="grid gridGapSmall gridTwoColumns container"
        onSubmit={createWishlistItem}
      >
        <div className="container">
          <div className="container grid">
            <label htmlFor="price"></label>
            <input
              onChange={(e) => setPrice(e.target.value)}
              type="text"
              name="price"
              placeholder="Price in DKK"
            />
          </div>
          <div className="container grid">
            <label htmlFor="link"></label>
            <input
              onChange={(e) => setLink(e.target.value)}
              type="text"
              name="link"
              placeholder="Link to the item"
            />
          </div>
        </div>
        <div className="relative flexEnd container alignItemsBottom">
          <button
            id={wishlistID}
            type="submit"
            className="active marginTopSmall"
            disabled={!validateForm()}
          >
            {!loading ? "Save item" : "Loading..."}
          </button>
        </div>
      </form>
    </section>
  );
};
export default CreateWishlistItem;
