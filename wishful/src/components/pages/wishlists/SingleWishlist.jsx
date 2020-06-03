import React, { useState, useEffect } from "react";
import axios from "axios";
import API from "./../../../data/api.json";

// HANDLE PROMPT
import usePromptHandler from "./../../hooks/PrompHandler";
import Prompt from "./../../Prompt";
// HANDLE LOADING
import Loader from "../../Loader";

// import WishlistItem from "./WishlistItem";
import UpdateWishList from "./UpdateWishlist";
import UpdateWishListItem from "./UpdateWishlistItem";
import CreateWishlistItem from "./CreateWishlistItem";

import useMessageHandler from "../../hooks/MessageHandler.jsx";
import Message from "./../../Message.jsx";
import { useHistory } from "react-router-dom";

const SingleWishlist = (props) => {
  const KeyLink = API.KeyLink;
  const searchID = props.searchID;

  const { message, showMessage } = useMessageHandler(null);
  const history = useHistory();

  const [loading, setLoading] = useState(false);
  const {
    promptMessage,
    promptHeader,
    showPromptMessage,
    closePromptMessage,
  } = usePromptHandler(null);

  const ID = props.match.params.wishlistID;
  const context = props.match.params.ID ? "public" : undefined;
  const userID = props.match.params.ID;

  const [singleWishlist, setWishList] = useState({});
  const [wishlistItems, setWishListItems] = useState([]);
  const [wishlistItemID, setWishListItemID] = useState([]);
  const [wishlistItem, setWishListItem] = useState("");
  const [letter, setLetter] = useState("");

  const [open, setOpen] = useState(false);
  const [update, setUpdate] = useState(false);
  const [showItems, setShowItems] = useState(false);
  const [showText, setShowText] = useState(false);

  const [deleteType, setDeleteType] = useState("");

  const fetchWishlist = async () => {
    setLoading(true);
    let response;

    try {
      if (!context) {
        // response = await axios.get(`http://localhost:9090/wishlists/${ID}`);
        response = await axios.get(
          `http://ec2-100-25-134-134.compute-1.amazonaws.com/wishlists/${ID}`
        );
      } else {
        response = await axios.get(
          // `http://localhost:9090/profile/${userID}/wishlists/${ID}`
          `http://ec2-100-25-134-134.compute-1.amazonaws.com/profile/${userID}/wishlists/${ID}`
        );
      }

      let data = response.data;
      console.log(data);
      setWishList(data.list);
      setWishListItems(data.items);
      setLoading(false);

      setLetter(data.list.name.charAt(0));
    } catch (error) {
      setLoading(false);
      // HANDLE ERROR
      showMessage(error.response.data.response);
      console.log(error.response.data.response);
    }
  };

  useEffect(() => {
    fetchWishlist();
  }, []);

  const handleUpdate = (event, updateType, wishlistItem) => {
    setUpdate(updateType);

    if (updateType === "item") {
      setWishListItem(wishlistItem);
    }
  };

  const handleDelete = (event, deleteType) => {
    event.preventDefault();
    setDeleteType(deleteType);

    if (deleteType === "item") {
      setWishListItemID(event.target.id);
      showPromptMessage(
        "Wait...",
        "Are you sure you want to delete this item from your wishlist?"
      );
    } else {
      event.preventDefault();
      showPromptMessage(
        "Wait...",
        "Are you sure you want to delete your wishlist?"
      );
    }
  };

  const confirmDelete = async () => {
    setLoading(true);
    let response;

    try {
      if (deleteType === "item") {
        response = await axios.get(
          // `http://localhost:9090/wishlists/${ID}/item/${wishlistItemID}/delete`
          `http://ec2-100-25-134-134.compute-1.amazonaws.com/wishlists/${ID}/item/${wishlistItemID}/delete`
        );
        fetchWishlist();
      } else {
        response = await axios.get(
          // `http://localhost:9090/wishlists/${ID}/delete`
          `http://ec2-100-25-134-134.compute-1.amazonaws.com/wishlists/${ID}/delete`
        );
        history.goBack();
      }

      let data = response.data.response;
      console.log(data);
      setLoading(false);
      closePromptMessage();
      showMessage(data);
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
      {!context && promptMessage ? (
        <Prompt
          resPromptMessage={promptMessage}
          resPromptHeader={promptHeader}
          cancelAction={closePromptMessage}
          confirmAction={confirmDelete}
          loading={loading}
        />
      ) : null}
      {!open && !update ? (
        <section className="singleWishlist relative marginTopSmall">
          <button
            className="secondary absolute textLeft"
            type="button"
            onClick={() => history.goBack()}
          >
            Back
          </button>
          {searchID ? (
            <button
              className="secondary textLeft"
              type="button"
              onClick={() => history.push(`/profile/${searchID}`)}
            >
              View users profile
            </button>
          ) : null}
          <div className="coverletter">{letter}</div>
          <>
            {wishlistItems.length !== 0 ? (
              <>
                <div className="banner grid gridTwoThirds">
                  <div>
                    <h2>Overview</h2>
                    <h1>{singleWishlist.name}</h1>
                    <h3>{singleWishlist.description}</h3>
                    <div className="btnContainer grid gridTwoColumns justifyContentLeft">
                      {!context ? (
                        <>
                          <button
                            className="secondary textLeft"
                            onClick={(event) => handleUpdate(event, "wishlist")}
                          >
                            Edit {singleWishlist.name}
                          </button>
                          <button
                            className="secondary textLeft"
                            type="button"
                            onClick={(event) => handleDelete(event, "wishlist")}
                          >
                            Delete {singleWishlist.name}
                          </button>
                        </>
                      ) : null}
                    </div>
                  </div>
                  {!context ? (
                    <div className="relative flexEnd alignItemsBottom">
                      <>
                        <button
                          className="active"
                          onClick={() => setOpen(true)}
                        >
                          Add item
                        </button>
                      </>
                    </div>
                  ) : null}
                </div>
                <div className="wishlistItems grid container gridTwoColumns gridGapSmall">
                  {showItems ? (
                    <>
                      {wishlistItems.map((wishlistItem, i) => (
                        <div
                          className="wishlistItem relative grid gridGapMedium"
                          id={wishlistItem.ID}
                          key={i}
                        >
                          <div className="grid gridTwoColumns gridGapSmall">
                            <a
                              className="secondary text-center"
                              href={wishlistItem.link}
                              rel="noopener noreferrer"
                              target="_blank"
                            >
                              <div
                                className="img bgContain"
                                style={{
                                  backgroundImage: `url(${wishlistItem.image})`,
                                }}
                              ></div>
                            </a>
                            <div className="grid paddingSmall">
                              <h3>{wishlistItem.title}</h3>
                              <div>
                                {wishlistItem.description.length > 70 ? (
                                  <>
                                    {showText ? (
                                      <p>{wishlistItem.description}</p>
                                    ) : (
                                      <p>
                                        {wishlistItem.description.substring(
                                          0,
                                          70
                                        )}
                                        ...
                                      </p>
                                    )}
                                    <button
                                      className="secondary text-center"
                                      onClick={() => setShowText(!showText)}
                                    >
                                      {showText ? "Show less" : "Show more"}
                                    </button>
                                  </>
                                ) : (
                                  <p>{wishlistItem.description}</p>
                                )}
                              </div>
                              <p className="alignSelfTop textRight">
                                {wishlistItem.price}
                              </p>

                              <div
                                id={wishlistItem.ID}
                                className={
                                  context
                                    ? "grid justifyContentCenter alignSelfCenter paddingSmall"
                                    : "grid gridTwoColumns justifyContentCenter alignSelfCenter paddingSmall"
                                }
                              >
                                <a
                                  className="secondary text-center"
                                  href={wishlistItem.link}
                                  rel="noopener noreferrer"
                                  target="_blank"
                                >
                                  See item
                                </a>
                                {!context ? (
                                  <>
                                    <button
                                      id={wishlistItem.ID}
                                      className="secondary absolute right"
                                      onClick={(event) =>
                                        handleDelete(event, "item")
                                      }
                                    >
                                      X
                                    </button>
                                    <button
                                      className="secondary"
                                      onClick={(event) =>
                                        handleUpdate(
                                          event,
                                          "item",
                                          wishlistItem
                                        )
                                      }
                                    >
                                      Edit item
                                    </button>
                                  </>
                                ) : null}
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </>
                  ) : (
                    <>
                      {wishlistItems.map((wishlistItem, i) =>
                        i < 4 ? (
                          <div
                            className="wishlistItem relative grid gridGapMedium"
                            id={wishlistItem.ID}
                            key={i}
                          >
                            <div className="grid gridTwoColumns gridGapSmall">
                              <a
                                className="secondary text-center"
                                href={wishlistItem.link}
                                rel="noopener noreferrer"
                                target="_blank"
                              >
                                <div
                                  className="img bgContain"
                                  style={{
                                    backgroundImage: `url(${wishlistItem.image})`,
                                  }}
                                ></div>
                              </a>
                              <div className="grid paddingSmall">
                                <h3>{wishlistItem.title}</h3>
                                <div>
                                  {wishlistItem.description.length > 70 ? (
                                    <>
                                      {showText ? (
                                        <p>{wishlistItem.description}</p>
                                      ) : (
                                        <p>
                                          {wishlistItem.description.substring(
                                            0,
                                            70
                                          )}
                                          ...
                                        </p>
                                      )}
                                      <button
                                        className="secondary textRight"
                                        onClick={() => setShowText(!showText)}
                                      >
                                        {showText ? "Show less" : "Show more"}
                                      </button>
                                    </>
                                  ) : (
                                    <p>{wishlistItem.description}</p>
                                  )}
                                </div>
                                <p className="alignSelfTop textRight">
                                  {wishlistItem.price}
                                </p>
                                <div
                                  className={
                                    context
                                      ? "grid justifyContentCenter alignSelfCenter paddingSmall"
                                      : "grid gridTwoColumns justifyContentCenter alignSelfCenter paddingSmall"
                                  }
                                >
                                  <a
                                    className="secondary text-center"
                                    href={wishlistItem.link}
                                    rel="noopener noreferrer"
                                    target="_blank"
                                  >
                                    See item
                                  </a>
                                  {!context ? (
                                    <>
                                      <button
                                        id={wishlistItem.ID}
                                        className="secondary absolute right"
                                        onClick={(event) =>
                                          handleDelete(event, "item")
                                        }
                                      >
                                        X
                                      </button>
                                      <button
                                        className="secondary"
                                        onClick={(event) =>
                                          handleUpdate(
                                            event,
                                            "item",
                                            wishlistItem
                                          )
                                        }
                                      >
                                        Edit item
                                      </button>
                                    </>
                                  ) : null}
                                </div>
                              </div>
                            </div>
                          </div>
                        ) : null
                      )}
                    </>
                  )}
                </div>
                {wishlistItems.length > 4 && !showItems ? (
                  <div className="grid container justifyContentCenter">
                    <button
                      className="secondary text-center"
                      onClick={() => setShowItems(true)}
                    >
                      Show all
                    </button>
                  </div>
                ) : wishlistItems.length > 4 && showItems ? (
                  <div className="grid container justifyContentCenter marginTopSmall">
                    <button
                      className="secondary text-center"
                      onClick={() => setShowItems(false)}
                    >
                      Show less
                    </button>
                  </div>
                ) : null}
              </>
            ) : (
              <>
                <div className="banner grid gridTwoThirds">
                  {!context ? (
                    <>
                      <div>
                        <h2>
                          You have no wishes yet for {singleWishlist.name}...
                        </h2>
                        <h1>Start making them come true today</h1>
                        <div className="btnContainer grid gridTwoColumns justifyContentLeft">
                          <button
                            className="secondary textLeft"
                            onClick={(event) => handleUpdate(event, "wishlist")}
                          >
                            Edit {singleWishlist.name}
                          </button>
                          <button
                            className="secondary textLeft"
                            type="button"
                            onClick={(event) => handleDelete(event, "wishlist")}
                          >
                            Delete {singleWishlist.name}
                          </button>
                        </div>
                      </div>
                      <div className="relative flexEnd alignItemsBottom">
                        <>
                          <button
                            className="active"
                            onClick={() => setOpen(true)}
                          >
                            Add item
                          </button>
                        </>
                      </div>
                    </>
                  ) : (
                    <div>
                      <p>This wishlist has no wishes yet...</p>
                      <h1 className="headerSection">Stay tuned for wishes</h1>
                    </div>
                  )}
                </div>
              </>
            )}
          </>
        </section>
      ) : open ? (
        <CreateWishlistItem
          KeyLink={KeyLink}
          setOpen={(data) => setOpen(data)}
          fetchWishlist={() => fetchWishlist()}
          showMessage={(data) => showMessage(data)}
          wishlistID={ID}
        />
      ) : update === "wishlist" ? (
        <UpdateWishList
          setUpdate={(data) => setUpdate(data)}
          fetchWishlist={() => fetchWishlist()}
          showMessage={(data) => showMessage(data)}
          singleWishlist={singleWishlist}
        />
      ) : update === "item" ? (
        <UpdateWishListItem
          KeyLink={KeyLink}
          ID={wishlistItemID}
          wishlistItem={wishlistItem}
          setOpen={(data) => setUpdate(data)}
          fetchWishlist={() => fetchWishlist()}
          showMessage={(data) => showMessage(data)}
          wishlistID={ID}
        />
      ) : null}
    </>
  );
};
export default SingleWishlist;

// <WishlistItem
//   wishlistItem={wishlistItem}
//   i={i}
//   wishlistID={ID}
//   showPromptMessage={(
//     resPromptHeader,
//     resPromptMessage
//   ) =>
//     showPromptMessage(
//       resPromptHeader,
//       resPromptMessage
//     )
//   }
//   showMessage={(data) => showMessage(data)}
//   fetchWishlist={(data) => fetchWishlist(data)}
//   setLoading={(data) => setLoading(data)}
//   setWishListItemID={(data) =>
//     setWishListItemID(data)
//   }
//   setDeleteType={(data) => setDeleteType(data)}
// />
