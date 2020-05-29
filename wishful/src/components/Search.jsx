import React, { useState } from "react";
import axios from "axios";
import { useHistory } from "react-router-dom";

// TO DO: SEARCH BOX BLUR DISAPPERANCE INTERFERES WITH NAVIGATION TO A NEW PAGE
// history.push changes the url but doesn't change profile if you are already in that component

const Search = ({ setSearchID }) => {
  const history = useHistory();
  const [active, setActive] = useState(false);
  const [searchResults, setSearchResults] = useState("");

  const handleSearch = async (e) => {
    e.target.value.length === 0 ? hideSearchContainer() : showSearchContainer();

    try {
      const response = await axios.get(
        `http://localhost:9090/search/users?term=${e.target.value}`
      );

      let data = response.data.response;

      let results = data.map((result) => ({
        ID: `${result.ID}`,
        firstName: `${result.firstName}`,
        lastName: `${result.lastName}`,
      }));

      setSearchResults(results);
    } catch (error) {
      setSearchResults(error.response.data.response);
      console.log(error.response.data.response);
    }
  };

  const showSearchContainer = (e) => {
    setActive(true);
  };

  const hideSearchContainer = (e) => {
    setActive(false);
    setSearchResults("");
    if (e) {
      e.target.value = "";
    }
  };

  const fetchProfile = (result) => {
    console.log(result);

    setSearchID(result.ID);
    history.push(`/profile/${result.ID}`);
  };

  return (
    <>
      <form id="frmSearch">
        {active ? (
          <input
            onInput={handleSearch}
            onFocus={showSearchContainer}
            // onBlur={hideSearchContainer}
            className="active"
            id="search"
            type="text"
            placeholder="Search on Wishful"
          />
        ) : (
          <input
            onInput={handleSearch}
            onFocus={showSearchContainer}
            // onBlur={hideSearchContainer}
            id="search"
            type="text"
            placeholder="&#xF002;"
          />
        )}
      </form>
      {searchResults.length !== 0 && searchResults !== "No result" ? (
        <div
          className="searchResults"
          style={active ? { display: "grid" } : { display: "none" }}
        >
          {searchResults.map((result, i) => (
            <p
              className="btnResult"
              id={result.ID}
              onClick={() => fetchProfile(result)}
              key={i}
            >
              {result.firstName} {result.lastName}
            </p>
          ))}
        </div>
      ) : searchResults === "No result" ? (
        <div
          className="searchResults"
          style={active ? { display: "grid" } : { display: "none" }}
        >
          <p>{searchResults}</p>
        </div>
      ) : null}
    </>
  );
};
export default Search;
