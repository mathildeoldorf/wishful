import React, { useState, useEffect } from "react";
import { useHistory } from "react-router-dom";
import SingleWishlist from "./SingleWishlist";
import "./wishlists.css";
import axios from "axios";
import CreateWishList from "./CreateWishlist.jsx";
//HANDLE MESSAGE
import useMessageHandler from "../../hooks/MessageHandler.jsx";
import Message from "./../../Message.jsx";
import Loader from "../../Loader";

const Wishlists = (props) => {
  const history = useHistory();

  const { message, showMessage } = useMessageHandler(null);
  const [loading, setLoading] = useState(false);

  const [userID, setUserID] = useState(props.userID);
  const [update, setUpdate] = useState(false);
  const [context, setContext] = useState(props.context);

  const [wishlistsBank, setWishlistsBank] = useState([]);
  const [singleWishlist, setSingleWishlist] = useState([]);

  useEffect(() => {
    fetchWishlists();
  }, []);

  const fetchWishlists = async () => {
    setLoading(true);
    try {
      let response;
      if (context) {
        response = await axios.get(
          `http://localhost:9090/profile/${userID}/wishlists/`
        );
      } else {
        response = await axios.get("http://localhost:9090/wishlists");
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

  const fetchSingleWishlist = (event) => {
    event.preventDefault();
    const data = {
      ID: event.target.id,
      name: event.target.name,
    };
    setSingleWishlist(data);
  };

  return (
    <>
      {loading ? <Loader /> : null}
      <Message resMessage={message} />
      {context === "public" ? (
        <>
          {singleWishlist.length === 0 ? (
            <section className="wishlists">
              {/* <Message resMessage={message} /> */}
              <h1 className="headerForm">Wishlists</h1>
              {!wishlistsBank.length ? (
                <div
                  className="placeholderContainer"
                  style={
                    !wishlistsBank.length
                      ? { color: "#fff", backgroundColor: "teal" }
                      : { color: "#44c4aa", backgroundColor: "#fff" }
                  }
                >
                  <div className="placeHolderMessage">
                    <p>No wishes yet...</p>
                    <h2>Start making them come true today</h2>
                  </div>
                </div>
              ) : null}

              <div
                style={
                  wishlistsBank.length > 2
                    ? { gridTemplateColumns: "repeat(3, 1fr)" }
                    : wishlistsBank.length === 2
                    ? { gridTemplateColumns: "repeat(2, 1fr)" }
                    : { gridTemplateColumns: "1fr" }
                }
                className="wishlistContainer"
              >
                {wishlistsBank.map((wishlist, i) => (
                  <button
                    className="btnSingleWishlist"
                    description={wishlist.description}
                    name={wishlist.name}
                    id={wishlist.ID}
                    onClick={fetchSingleWishlist}
                    key={i}
                  >
                    <h2 id={wishlist.ID}>{wishlist.name}</h2>
                    <p id={wishlist.ID}>{wishlist.description}</p>
                  </button>
                ))}
              </div>
            </section>
          ) : (
            <SingleWishlist
              userID={userID}
              context={context}
              openWishlist={(data) => setSingleWishlist(data)}
              fetchWishlists={() => fetchWishlists()}
              wishlist={singleWishlist}
              ID={singleWishlist.ID}
            />
          )}
        </>
      ) : !context && !update ? (
        <>
          {singleWishlist.length === 0 ? (
            <section className="wishlists">
              {<h1 className="headerForm">Your wishlists</h1>}
              {/* <Message resMessage={message} /> */}
              {!wishlistsBank.length ? (
                <div
                  className="placeholderContainer"
                  style={
                    !wishlistsBank.length
                      ? { color: "#fff", backgroundColor: "teal" }
                      : { color: "#44c4aa", backgroundColor: "#fff" }
                  }
                >
                  <div className="placeHolderMessage">
                    <p>You have no wishes yet...</p>
                    <h2>Start making them come true today</h2>
                  </div>
                </div>
              ) : null}

              <div
                className="wishlistContainer"
                style={
                  wishlistsBank.length > 2
                    ? { gridTemplateColumns: "repeat(3, 1fr)" }
                    : wishlistsBank.length === 2
                    ? { gridTemplateColumns: "repeat(2, 1fr)" }
                    : { gridTemplateColumns: "1fr" }
                }
              >
                {wishlistsBank.map((wishlist, i) => (
                  <button
                    className="btnSingleWishlist"
                    description={wishlist.description}
                    name={wishlist.name}
                    id={wishlist.ID}
                    onClick={fetchSingleWishlist}
                    key={i}
                  >
                    <h2 id={wishlist.ID}>{wishlist.name}</h2>
                    <p id={wishlist.ID}>{wishlist.description}</p>
                  </button>
                ))}
              </div>
              <button
                className="btnCreateWishList active"
                onClick={() => setUpdate(true)}
              >
                Create wishlist
              </button>
              <button type="button" onClick={() => history.goBack()}>
                Back
              </button>
            </section>
          ) : (
            <SingleWishlist
              openWishlist={(data) => setSingleWishlist(data)}
              fetchWishlists={() => fetchWishlists()}
              wishlist={singleWishlist}
              ID={singleWishlist.ID}
              showMessage={(data) => showMessage(data)}
            />
          )}
        </>
      ) : (
        <div className="wishlistContainer">
          <CreateWishList
            setUpdate={(data) => setUpdate(data)}
            fetchWishlists={() => fetchWishlists()}
            showMessage={(data) => showMessage(data)}
          />
        </div>
      )}
    </>
  );
};
export default Wishlists;
