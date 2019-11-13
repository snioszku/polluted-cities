import React, { useState, useEffect } from "react";
import City from "./City";

const Search = () => {
  const [country, setCountry] = useState("");
  const [cities, setCites] = useState([]);
  const [pollutions, setPollutions] = useState([]);
  const [pollution, setPollution] = useState();

  const take = async () => {
    const response = await fetch(
      `https://api.openaq.org/v1/measurements?country=${country}&parameter=${pollution}&limit=10`
    );
    const myJson = await response.json();
    console.log(myJson.results);
    setCites(myJson.results);
  };

  useEffect(() => {
    fetch("https://api.openaq.org/v1/parameters ")
      .then(response => response.json())
      .then(data => {
        setPollutions(data.results);
      });
  }, []);

  return (
    <div>
      <div className="search">
        <form
          onSubmit={e => {
            e.preventDefault();
            console.log(e.target.name);
            take();
          }}
        >
          <label htmlFor="country">
            Country:
            <input
              type="text"
              id="country"
              placeholder="type country name"
              value={country}
              onChange={e => setCountry(e.target.value)}
              required
            ></input>
          </label>{" "}
          <br />
          <br />
          <label htmlFor="location">
            <select
              id="location"
              placeholder="Location"
              required
              onChange={e => setPollution(e.target.value)}
            >
              <option value={pollution}>--Choose pollution--</option>
              {pollutions.map((poll, i) => (
                <option value={poll.id} key={i}>
                  {poll.description}
                </option>
              ))}
            </select>
          </label>
          <br />
          <br />
          <button type="submit">Submit</button>
        </form>
      </div>

      <City cities={cities} />
    </div>
  );
};

export default Search;
