import React, { useState } from "react";
import axios from "axios";
import API from "./../../../data/api.json";

const WishlistItem = ({
  wishlistItem,
  i,
  fetchWishlist,
  wishlistID,
  showPromptMessage,
  setDeleteType,
  showMessage,
  setLoading,
  setWishListItemID,
}) => {
  // const KeyLink = API.KeyLink;
  // const [price, setPrice] = useState(0);
  // const [link, setLink] = useState([]);
  // const [open, setOpen] = useState(false);
  // //   const [wishlistItemID, setWishListItemID] = useState([]);
  // console.log(wishlistItem);
  // const validateForm = () => {
  //   return link.length > 0 && parseInt(price);
  //   // return description.length > 0 && link.length > 0 && parseInt(price);
  // };

  // const addWishlistItem = async (event) => {
  //   setLoading(true);
  //   event.preventDefault();

  //   try {
  //     let linkPreviewResponse = await axios.get(
  //       `http://api.linkpreview.net/?key=${KeyLink}&q=${link}`,
  //       {
  //         withCredentials: false,
  //       }
  //     );

  //     let dataLinkPreview = linkPreviewResponse.data;

  //     console.log(dataLinkPreview.title);

  //     let response = await axios.post(
  //       `http://localhost:9090/wishlists/${wishlistID}/item`,
  //       {
  //         title: dataLinkPreview.title,
  //         description: dataLinkPreview.description,
  //         price: price,
  //         link: dataLinkPreview.url,
  //       }
  //     );

  //     let data = response.data;

  //     console.log(data);

  //     setLoading(false);
  //     fetchWishlist();
  //     setOpen(false);
  //     showMessage(data.message);
  //   } catch (error) {
  //     setLoading(false);
  //     // HANDLE ERROR
  //     showMessage(error.response.data.response);
  //     console.log(error.response.data.response);
  //   }
  // };

  // const deleteItem = (event) => {
  //   event.preventDefault();
  //   console.log("deleting" + wishlistItem.ID);
  //   setWishListItemID(wishlistItem.ID);
  //   setDeleteType("item");
  //   showPromptMessage(
  //     "Wait...",
  //     "Are you sure you want to delete this item from your wishlist?"
  //   );
  // };

  return (
    <div className="wishlistItem" id={wishlistItem.ID} key={i}>
      {/* <h3>{wishlistItem.title}</h3>
      <p>{wishlistItem.price} DKK</p>
      <a href={wishlistItem.link} target="_blank">
        <p>See item</p>
      </a>
      <button className="btnDelete" onClick={deleteItem}>
        X
      </button> */}
    </div>
  );
};

export default WishlistItem;
