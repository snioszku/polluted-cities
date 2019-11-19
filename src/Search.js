import React, { useState, useEffect } from 'react';

import Accordion from 'react-bootstrap/Accordion';
import Card from 'react-bootstrap/Card';
import removeDuplicate from './functions/removeDuplicates';
import removeDiacritics from './functions/removeDiacritics';
import deletePrefix from './functions/deletePrefix';
import CityList from './CityList';

const Search = () => {
  const [country, setCountry] = useState('');
  const [cities, setCites] = useState([]);
  const [pollutions, setPollutions] = useState([]);
  const [pollution, setPollution] = useState();
  const [descriptions, setDescriptions] = useState('');

  let countryISO = '';

  const getISO = () => {
    if (country.toLowerCase() === 'poland') {
      countryISO = 'PL';
    } else if (country.toLowerCase() === 'spain') {
      countryISO = 'ES';
    } else if (country.toLowerCase() === 'germany') {
      countryISO = 'DE';
    } else if (country.toLowerCase() === 'france') {
      countryISO = 'FR';
    }
    return countryISO;
  };

  async function moreDetails(e) {
    e.persist();
    const cityName = removeDiacritics(e.target.id);

    const response = await fetch(
      `https://en.wikipedia.org/w/api.php?action=query&format=json&prop=extracts&exsentences=10&explaintext&origin=*&titles=${cityName}`,
    );
    const myJson = await response.json();
    let numkey = Object.keys(myJson.query.pages).join();

    setDescriptions(myJson.query.pages[numkey].extract);
  }

  const take = async () => {
    const response = await fetch(
      `https://api.openaq.org/v1/latest?order_by=measurements[0].value&sort=desc&parameter=${pollution}&limit=10000&country=${countryISO}`,
    );
    const myJson = await response.json();

    const mostPolluted = removeDuplicate(myJson.results, element => {
      return element.city;
    }).slice(0, 10);

    const noPrefix = mostPolluted.map(el => {
      el.city = deletePrefix(el.city);
      return el;
    });
    setCites(noPrefix);
  };

  useEffect(() => {
    fetch('https://api.openaq.org/v1/parameters')
      .then(response => response.json())
      .then(({ results }) => {
        setPollutions(results);
      });
  });

  return (
    <div className="search">
      <form
        onSubmit={e => {
          e.preventDefault();
          getISO();
          take();
        }}
      >
        <label htmlFor="country">
          Country:
          <input
            type="text"
            id="country"
            placeholder="Type country name"
            value={country}
            onChange={e => setCountry(e.target.value)}
            required
            pattern="^(Poland|Germany|France|Spain).*$"
          ></input>{' '}
          <br />
        </label>{' '}
        <p>Allowed countries names: Poland |Germany |France | Spain</p>
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
        <button type="submit">Search</button>
      </form>
      <CityList
        cities={cities}
        descriptions={descriptions}
        moreDetails={moreDetails}
      />
    </div>
  );
};

export default Search;
