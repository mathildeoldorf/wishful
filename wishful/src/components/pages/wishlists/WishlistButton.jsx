import React from "react";
import { useHistory } from "react-router-dom";

const WishlistButton = ({ i, wishlist, userID, context }) => {
  const history = useHistory();

  const letter = wishlist.name.charAt(0);

  const handleClick = (e) => {
    e.preventDefault();
    context
      ? history.push(`/profile/${userID}/wishlist/${wishlist.ID}`)
      : history.push(`/wishlists/wishlist/${wishlist.ID}`);
  };

  return (
    <button
      className="btnSingleWishlist relative"
      id={wishlist.ID}
      onClick={handleClick}
      key={i}
    >
      <div className="coverletter">{letter}</div>
      <span>
        <h2 id={wishlist.ID}>{wishlist.name}</h2>
        <p id={wishlist.ID}>{wishlist.description}</p>
      </span>
    </button>
  );
};

export default WishlistButton;
