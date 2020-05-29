import React, { useState, useEffect } from "react";
import axios from "axios";
import API from "./../../../data/api.json";

// HANDLE PROMPT
import usePromptHandler from "./../../hooks/PrompHandler";
import Prompt from "./../../Prompt";
// HANDLE LOADING
import Loader from "../../Loader";

import WishlistItem from "./WishlistItem";
import UpdateWishList from "./UpdateWishlist";
import UpdateWishListItem from "./UpdateWishlistItem";

const SingleWishlist = ({
  userID,
  context,
  wishlist,
  ID,
  openWishlist,
  fetchWishlists,
  showMessage,
}) => {
  const KeyLink = API.KeyLink;

  const [loading, setLoading] = useState(false);
  const {
    promptMessage,
    promptHeader,
    showPromptMessage,
    closePromptMessage,
  } = usePromptHandler(null);

  const [open, setOpen] = useState(false);
  const [update, setUpdate] = useState(false);
  const [showItems, setShowItems] = useState(false);

  const [deleteType, setDeleteType] = useState("");

  const [singleWishlist, setWishList] = useState(wishlist);
  const [wishlistItems, setWishListItems] = useState([]);
  const [wishlistItemID, setWishListItemID] = useState([]);
  const [wishlistItem, setWishListItem] = useState("");

  const [price, setPrice] = useState(0);
  const [link, setLink] = useState([]);

  const fetchWishlist = async () => {
    setLoading(true);
    let response;

    try {
      if (!context) {
        response = await axios.get(`http://localhost:9090/wishlists/${ID}`);
      } else {
        response = await axios.get(
          `http://localhost:9090/profile/${userID}/wishlists/${ID}`
        );
      }

      let data = response.data;
      console.log(data);
      setWishList(data.list);
      setWishListItems(data.items);
      setLoading(false);
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

  // ######################################  ADDING WISHLIST ITEM
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

      console.log(dataLinkPreview);

      let response = await axios.post(
        `http://localhost:9090/wishlists/${ID}/item`,
        {
          title: dataLinkPreview.title,
          description: dataLinkPreview.description,
          price: price,
          link: dataLinkPreview.url,
          image: dataLinkPreview.image,
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

  const handleUpdate = (event, updateType, wishlistItem) => {
    setUpdate(updateType);

    if (updateType === "item") {
      setWishListItemID(event.target.parentElement.id);
      setWishListItem(wishlistItem);
    }
  };

  const handleDelete = (event, deleteType) => {
    event.preventDefault();
    setDeleteType(deleteType);

    if (deleteType === "item") {
      setWishListItemID(event.target.parentElement.id);
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
          `http://localhost:9090/wishlists/${ID}/item/${wishlistItemID}/delete`
        );
        fetchWishlist();
      } else {
        response = await axios.get(
          `http://localhost:9090/wishlists/${ID}/delete`
        );
        openWishlist([]);
        fetchWishlists();
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
      {context === "public" ? (
        <>
          {wishlistItems.length !== 0 ? (
            <section className="singleWishlist">
              {showItems ? (
                <>
                  <div className="banner bannerNarrow">
                    <h1 className="headerSection">{singleWishlist.name}:</h1>
                    <p>Overview</p>
                  </div>
                  <div className="wishlistItems">
                    {wishlistItems.map((wishlistItem, i) => (
                      <div
                        className="wishlistItem"
                        id={wishlistItem.ID}
                        key={i}
                      >
                        <div
                          className="img bgContain"
                          style={{
                            backgroundImage: `url(${wishlistItem.image})`,
                          }}
                        ></div>
                        <h3>{wishlistItem.title}</h3>
                        <p>{wishlistItem.price} DKK</p>
                        <a href={wishlistItem.link} target="_blank">
                          <p>See item</p>
                        </a>
                      </div>
                      // <WishlistItem
                      //   wishlistItem={wishlistItem}
                      //   i={i}
                      //   wishlistID={ID}
                      //   showPromptMessage={(
                      //     resPromptHeader,
                      //     resPromptMessage
                      //   ) =>
                      //     showPromptMessage(resPromptHeader, resPromptMessage)
                      //   }
                      //   showMessage={(data) => showMessage(data)}
                      //   fetchWishlist={(data) => fetchWishlist(data)}
                      //   setLoading={(data) => setLoading(data)}
                      //   setWishListItemID={(data) => setWishListItemID(data)}
                      //   setDeleteType={(data) => setDeleteType(data)}
                      // />
                    ))}
                    <button
                      className="btnToggleShow"
                      onClick={() => setShowItems(false)}
                    >
                      Show less
                    </button>
                    <button onClick={() => openWishlist([])}>Back</button>
                  </div>
                </>
              ) : (
                <>
                  <div className="banner">
                    <h1 className="headerSection">{singleWishlist.name}</h1>
                    <p>{singleWishlist.description}</p>
                  </div>
                  <div className="wishlistItems">
                    {wishlistItems.map((wishlistItem, i) =>
                      i < 3 ? (
                        <div
                          className="wishlistItem"
                          style={{ gridTemplateColumns: "2fr 1.2fr 0.75fr" }}
                          id={wishlistItem.ID}
                          key={i}
                        >
                          <div
                            className="img bgContain"
                            style={{
                              backgroundImage: `url(${wishlistItem.image})`,
                            }}
                          ></div>
                          <h3>{wishlistItem.title}</h3>
                          <p>{wishlistItem.price} DKK</p>
                          <a
                            style={{ display: "grid", justifySelf: "flex-end" }}
                            href={wishlistItem.link}
                            target="_blank"
                          >
                            <p>See item</p>
                          </a>
                        </div>
                      ) : // <WishlistItem
                      //   wishlistItem={wishlistItem}
                      //   i={i}
                      //   wishlistID={ID}
                      //   showPromptMessage={(
                      //     resPromptHeader,
                      //     resPromptMessage
                      //   ) =>
                      //     showPromptMessage(resPromptHeader, resPromptMessage)
                      //   }
                      //   showMessage={(data) => showMessage(data)}
                      //   fetchWishlist={(data) => fetchWishlist(data)}
                      //   setLoading={(data) => setLoading(data)}
                      //   setWishListItemID={(data) => setWishListItemID(data)}
                      //   setDeleteType={(data) => setDeleteType(data)}
                      //   grid={"2fr 1.2fr 0.75fr"}
                      // />
                      null
                    )}
                    {wishlistItems.length > 3 ? (
                      <button
                        className="btnToggleShow"
                        onClick={() => setShowItems(true)}
                      >
                        Show all
                      </button>
                    ) : null}
                    <button onClick={() => openWishlist([])}>Back</button>
                  </div>
                </>
              )}
            </section>
          ) : (
            <section className="singleWishlist">
              <div className="banner">
                <p>This wishlist has no wishes yet...</p>
                <h1 className="headerSection">Stay tuned for wishes</h1>
              </div>
              <div className="wishlistItems">
                <button onClick={() => openWishlist([])}>Back</button>
              </div>
            </section>
          )}
        </>
      ) : !context ? (
        <section className="singleWishlist">
          <>
            {promptMessage ? (
              <Prompt
                resPromptMessage={promptMessage}
                resPromptHeader={promptHeader}
                cancelAction={closePromptMessage}
                confirmAction={confirmDelete}
                loading={loading}
              />
            ) : null}
            {!open && !update ? (
              <>
                {wishlistItems.length !== 0 ? (
                  <>
                    {showItems ? (
                      <>
                        <div className="banner bannerNarrow">
                          <h1 className="headerSection">
                            {singleWishlist.name}
                          </h1>
                          <p>Overview</p>
                          <button
                            onClick={(event) => handleUpdate(event, "wishlist")}
                          >
                            Update {singleWishlist.name}
                          </button>
                        </div>
                        <div className="wishlistItems">
                          {wishlistItems.map((wishlistItem, i) => (
                            <div
                              className="wishlistItem"
                              id={wishlistItem.ID}
                              key={i}
                            >
                              <div
                                className="img bgContain"
                                style={{
                                  backgroundImage: `url(${wishlistItem.image})`,
                                }}
                              ></div>
                              <h3>{wishlistItem.title}</h3>
                              <p>{wishlistItem.price} DKK</p>
                              <a href={wishlistItem.link} target="_blank">
                                <p>See item</p>
                              </a>
                              <button
                                className="btnDelete"
                                onClick={(event) => handleDelete(event, "item")}
                              >
                                X
                              </button>
                              <button
                                onClick={(event) =>
                                  handleUpdate(event, "item", wishlistItem)
                                }
                              >
                                Update item
                              </button>
                            </div>
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
                          ))}
                          <button
                            className="btnToggleShow"
                            onClick={() => setShowItems(false)}
                          >
                            Show less
                          </button>
                          <div className="grid twoColumnContainer">
                            <button onClick={() => openWishlist([])}>
                              Back
                            </button>
                            <button
                              className="active"
                              onClick={() => setOpen(true)}
                            >
                              Add item
                            </button>
                          </div>
                          <button
                            onClick={(event) => handleDelete(event, "wishlist")}
                          >
                            Delete {singleWishlist.name}
                          </button>
                        </div>
                      </>
                    ) : (
                      <>
                        <div className="banner">
                          <h1 className="headerSection">
                            {singleWishlist.name}
                          </h1>
                          <p>{singleWishlist.description}</p>
                          <button
                            onClick={(event) => handleUpdate(event, "wishlist")}
                          >
                            Update {singleWishlist.name}
                          </button>
                        </div>
                        <div className="wishlistItems">
                          {wishlistItems.map((wishlistItem, i) =>
                            i < 3 ? (
                              <div
                                className="wishlistItem"
                                id={wishlistItem.ID}
                                key={i}
                              >
                                <div
                                  className="img bgContain"
                                  style={{
                                    backgroundImage: `url(${wishlistItem.image})`,
                                  }}
                                ></div>
                                <h3>{wishlistItem.title}</h3>
                                <p>{wishlistItem.price} DKK</p>
                                <a href={wishlistItem.link} target="_blank">
                                  <p>See item</p>
                                </a>
                                <button
                                  className="btnDelete"
                                  onClick={(event) =>
                                    handleDelete(event, "item")
                                  }
                                >
                                  X
                                </button>
                                <button
                                  onClick={(event) =>
                                    handleUpdate(event, "item", wishlistItem)
                                  }
                                >
                                  Update item
                                </button>
                              </div>
                            ) : // <WishlistItem
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
                            null
                          )}
                          {wishlistItems.length > 3 ? (
                            <button
                              className="btnToggleShow"
                              onClick={() => setShowItems(true)}
                            >
                              Show all
                            </button>
                          ) : null}
                          <div className="grid twoColumnContainer">
                            <button onClick={() => openWishlist([])}>
                              Back
                            </button>
                            <button
                              className="active"
                              onClick={() => setOpen(true)}
                            >
                              Add item
                            </button>
                          </div>
                          <button
                            onClick={(event) => handleDelete(event, "wishlist")}
                          >
                            Delete {singleWishlist.name}
                          </button>
                        </div>
                      </>
                    )}
                  </>
                ) : (
                  <>
                    <div className="banner">
                      {/* <h1 className="headerSection">{singleWishlist.name}</h1>
                      <p>{singleWishlist.description}</p> */}
                      <p>You have no wishes yet for {singleWishlist.name}...</p>
                      <h1 className="headerSection">
                        Start making them come true today
                      </h1>
                      <button
                        onClick={(event) => handleUpdate(event, "wishlist")}
                      >
                        Update {singleWishlist.name}
                      </button>
                    </div>
                    <div className="wishlistItems">
                      <button className="active" onClick={() => setOpen(true)}>
                        Add item
                      </button>
                      <div className="grid twoColumnContainer">
                        <button onClick={() => openWishlist([])}>Back</button>
                        <button
                          onClick={(event) => handleDelete(event, "wishlist")}
                        >
                          Delete {singleWishlist.name}
                        </button>
                      </div>
                    </div>
                  </>
                )}
              </>
            ) : open ? (
              <>
                <div className="banner">
                  <p>Almost done...</p>
                  <h1 className="headerSection">
                    Simply link the item of your dreams
                  </h1>
                </div>
                <form onSubmit={createWishlistItem}>
                  <div className="sepContainer">
                    <label htmlFor="price"></label>
                    <input
                      onChange={(e) => setPrice(e.target.value)}
                      type="text"
                      name="price"
                      placeholder="Price in DKK"
                    />
                    <label htmlFor="link"></label>
                    <input
                      onChange={(e) => setLink(e.target.value)}
                      type="text"
                      name="link"
                      placeholder="Link to the item"
                    />
                  </div>
                  <div className="grid twoColumnContainer">
                    <button onClick={() => setOpen(false)}>Back</button>
                    <button
                      id={singleWishlist.ID}
                      type="submit"
                      className={validateForm() ? "active" : ""}
                      disabled={!validateForm()}
                    >
                      {!loading ? "Save item" : "Loading..."}
                    </button>
                  </div>
                </form>
              </>
            ) : update === "wishlist" ? (
              <UpdateWishList
                ID={ID}
                setUpdate={(data) => setUpdate(data)}
                fetchWishlist={() => fetchWishlist()}
                showMessage={(data) => showMessage(data)}
                singleWishlist={singleWishlist}
              />
            ) : update == "item" ? (
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
        </section>
      ) : null}
    </>
  );
};
export default SingleWishlist;
