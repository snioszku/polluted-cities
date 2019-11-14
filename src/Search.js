import React, { useState, useEffect } from 'react';

import Accordion from 'react-bootstrap/Accordion';
import Card from 'react-bootstrap/Card';

const Search = () => {
  const [country, setCountry] = useState('');
  const [cities, setCites] = useState([]);
  const [pollutions, setPollutions] = useState([]);
  const [pollution, setPollution] = useState();
  const [descriptions, setDescritpoins] = useState('');

  let countryISO = '';
  const updatedData = [];
  let updatedData10 = [];
  const updatedDataPollutions = [];

  useEffect(() => {
    setPollutions([]);
    fetch('https://api.openaq.org/v1/parameters ')
      .then(response => response.json())
      .then(data => {
        setPollutions(data.results);
      });
  }, []);

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
  };

  const take = async () => {
    const response = await fetch(
      `https://api.openaq.org/v1/latest?order_by=measurements[0].value&sort=desc&parameter=${pollution}&limit=10000&country=${countryISO}`,
    );
    const myJson = await response.json();

    for (let i = 0; i < myJson.results.length; i++) {
      if (!updatedData.includes(myJson.results[i].city)) {
        updatedData.push(myJson.results[i].city);
      }
    }
    updatedData10 = updatedData.slice(0, 10);

    for (let i = 0; i < updatedData10.length; i++) {
      if (updatedData10[i].includes('CCAA')) {
        updatedData10[i] = updatedData10.replace('CCAA ', '');
      }

      if (updatedData10[i].includes('Com.')) {
        updatedData10[i] = updatedData10[i].replace('Com. ', '');
      }
    }

    updatedData10.forEach(el =>
      fetch(
        `https://api.openaq.org/v1/latest?city=${el}&parameter=${pollution}&sort=desc&limit=1`,
      )
        .then(response => response.json())
        .then(data => updatedDataPollutions.push(data)),
    );
    setCites(updatedDataPollutions);
    console.log(updatedData10, updatedDataPollutions, cities);
  };

  useEffect(() => {
    fetch(
      'https://en.wikipedia.org/w/api.php?action=query&format=json&prop=extracts&explaintext&origin=*&titles=Przemyśl',
    )
      .then(response => response.json())
      .then(data => {
        let numkey = Object.keys(data.query.pages).join();
        setDescritpoins(data.query.pages[numkey].extract);
      });
  }, []);

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
            ></input>
          </label>{' '}
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
      <Accordion defaultActiveKey="0">
        {cities.map(({ results }, i) => (
          <Card key={i}>
            <Accordion.Toggle as={Card.Header} eventKey={i}>
              <h3>{results[0].city}</h3>
              <p>
                Pollution level: <br />
                <br />
                <span>
                  {results[0].measurements[0].value}
                  {results[0].measurements[0].unit}
                </span>
              </p>
              <h5>More details</h5>
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
