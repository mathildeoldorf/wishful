import React, { useState } from "react";
import axios from "axios";
import { useHistory } from "react-router-dom";

const Search = ({ setSearchID }) => {
  const history = useHistory();
  const [active, setActive] = useState(false);
  const [searchResults, setSearchResults] = useState("");

  const handleSearch = async (e) => {
    e.target.value.length === 0 ? hideSearchContainer() : showSearchContainer();

    try {
      const response = await axios.get(
        // `http://localhost:9090/search/users?term=${e.target.value}`
        `http://ec2-54-90-37-154.compute-1.amazonaws.com/search/users?term=${e.target.value}`
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
    if (e) {
      e.target.value = "";
    }
    setTimeout(() => {
      setSearchResults("");
      setActive(false);
    }, 200);
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
            onBlur={hideSearchContainer}
            className="active"
            id="search"
            type="text"
            placeholder="Search on Wishful"
          />
        ) : (
          <input
            onInput={handleSearch}
            onFocus={showSearchContainer}
            onBlur={hideSearchContainer}
            id="search"
            type="text"
            placeholder="&#xF002;"
          />
        )}
      </form>
      {searchResults.length !== 0 && searchResults !== "No result" ? (
        <div className="searchResults">
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
        <div className="searchResults">
          <p>{searchResults}</p>
        </div>
      ) : null}
    </>
  );
};
export default Search;
