import React from "react";

const WishlistButton = ({ i, wishlist, fetchSingleWishlist }) => {
  const letter = wishlist.name.charAt(0);

  const handleClick = (e) => {
    e.preventDefault();
    fetchSingleWishlist(wishlist);
  };

  return (
    <button
      className="btnSingleWishlist relative"
      description={wishlist.description}
      name={wishlist.name}
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
