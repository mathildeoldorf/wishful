import React, { useState, useEffect } from "react";
import { useHistory, Link } from "react-router-dom";
import "./wishlists.css";
import axios from "axios";
import CreateWishList from "./CreateWishlist.jsx";
//HANDLE MESSAGE
import useMessageHandler from "../../hooks/MessageHandler.jsx";
import Message from "./../../Message.jsx";
import Loader from "../../Loader";
import WishlistButton from "./WishlistButton";

const Wishlists = ({ userID, context }) => {
  const history = useHistory();

  const { message, showMessage } = useMessageHandler(null);
  const [loading, setLoading] = useState(false);

  const [update, setUpdate] = useState(false);

  const [wishlistsBank, setWishlistsBank] = useState([]);

  useEffect(() => {
    fetchWishlists();
  }, []);

  const fetchWishlists = async () => {
    setLoading(true);
    try {
      let response;
      if (context) {
        response = await axios.get(
          // `http://localhost:9090/profile/${userID}/wishlists/`
          `http://ec2-100-25-134-134.compute-1.amazonaws.com/profile/${userID}/wishlists/`
        );
      } else {
        // response = await axios.get("http://localhost:9090/wishlists");
        response = await axios.get(
          "http://ec2-100-25-134-134.compute-1.amazonaws.com/wishlists"
        );
      }

      let data = response.data.response;

      let wishlists = data.map((wishlist) => ({
        ID: `${wishlist.ID}`,
        name: `${wishlist.name}`,
        description: `${wishlist.description}`,
      }));

      setWishlistsBank(wishlists);
      setTimeout(() => {
        setLoading(false);
      }, 500);
    } catch (error) {
      setLoading(false);
      // HANDLE ERROR
      showMessage(error.response.data.response);
      console.log(error.response.data.response);
    }
  };

  return (
    <>
      {loading ? <Loader /> : null}
      <Message resMessage={message} />
      {!update ? (
        <>
          <section
            className={
              !context
                ? "wishlists relative"
                : "wishlists relative marginTopMedium"
            }
          >
            <button
              className="secondary absolute textLeft left"
              type="button"
              onClick={() => history.goBack()}
            >
              Back
            </button>
            <div
              className={
                !context
                  ? "banner relative grid gridTwoThirds"
                  : "banner relative"
              }
            >
              <div>
                <h2>Overview</h2>
                <h1>Wishlists</h1>
              </div>
              {!context && wishlistsBank.length ? (
                <div className="relative flexEnd alignItemsBottom">
                  <button
                    className="btnCreateWishList active"
                    onClick={() => setUpdate(true)}
                  >
                    Create wishlist
                  </button>
                </div>
              ) : null}
            </div>
            {!wishlistsBank.length ? (
              <div className="banner">
                {!context ? (
                  <div className="container grid justifyContentCenter">
                    <button
                      className="btnCreateWishList active marginTopSmall"
                      onClick={() => setUpdate(true)}
                    >
                      Create wishlist
                    </button>
                  </div>
                ) : (
                  <h2>No wishlists yet...</h2>
                )}
              </div>
            ) : (
              <div className="wishlistContainer grid gridFourColumns container gridGapSmall">
                {wishlistsBank.map((wishlist, i) => (
                  <WishlistButton
                    userID={userID}
                    context={context}
                    i={i}
                    key={i}
                    wishlist={wishlist}
                  />
                ))}
              </div>
            )}
          </section>
        </>
      ) : (
        <CreateWishList
          setUpdate={(data) => setUpdate(data)}
          fetchWishlists={() => fetchWishlists()}
          showMessage={(data) => showMessage(data)}
        />
      )}
    </>
  );
};
export default Wishlists;
