import React, { useState, useEffect } from 'react';

import Accordion from 'react-bootstrap/Accordion';
import Card from 'react-bootstrap/Card';
import removeDuplicate from './removeDuplicates.js';

const Search = () => {
  const [country, setCountry] = useState('');
  const [cities, setCites] = useState([]);
  const [pollutions, setPollutions] = useState([]);
  const [pollution, setPollution] = useState();
  const [descriptions, setDescriptions] = useState('');

  let countryISO = '';
  const updatedDataPollutionsDescipt = [];
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
    const cityName = e.target.id;

    const response = await fetch(
      `https://en.wikipedia.org/w/api.php?action=query&format=json&prop=extracts&exsentences=10&explaintext&origin=*&titles=${cityName}`,
    );
    const myJson = await response.json();
    let numkey = Object.keys(myJson.query.pages).join();

    setDescriptions(myJson.query.pages[numkey].extract);
    console.log(e.target.id);
  }

  const take = async () => {
    const response = await fetch(
      `https://api.openaq.org/v1/latest?order_by=measurements[0].value&sort=desc&parameter=${pollution}&limit=10000&country=${countryISO}`,
    );
    const myJson = await response.json();

    const mostPolluted = removeDuplicate(myJson.results, element => {
      return element.city;
    }).slice(0, 10);
    setCites(mostPolluted);
    console.log('dziala', mostPolluted);
  };

  useEffect(() => {
    fetch('https://api.openaq.org/v1/parameters')
      .then(response => response.json())
      .then(data => {
        setPollutions(data.results);
      });
  });

  return (
    <div>
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
              placeholder="type country name"
              value={country}
              onChange={e => setCountry(e.target.value)}
              required
              pattern="^(Poland|Germany|France|Spain).*$"
            ></input>{' '}
            <br />
            <p>Allowed countries names: Poland |Germany |France | Spain</p>
          </label>{' '}
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
          <button type="submit">Submit</button>
        </form>
      </div>
      <Accordion defaultActiveKey="0">
        {cities.map(({ city, measurements }, i) => (
          <Card key={i}>
            <Accordion.Toggle as={Card.Header} eventKey={i}>
              <h3>{city}</h3>
              <p>
                Pollution level:
                <span>
                  {measurements[0].value}
                  {measurements[0].unit}
                </span>
              </p>
              <h5
                id={city}
                onClick={e => {
                  moreDetails(e);
                }}
              >
                More details
              </h5>
            </Accordion.Toggle>
            <Accordion.Collapse eventKey={i}>
              <Card.Body>{descriptions}</Card.Body>
            </Accordion.Collapse>
          </Card>
        ))}
      </Accordion>
    </div>
  );
};

export default Search;
