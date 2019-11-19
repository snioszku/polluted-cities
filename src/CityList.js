import React from 'react';
import Accordion from 'react-bootstrap/Accordion';
import Card from 'react-bootstrap/Card';

const CityList = props => {
  return (
    <div className="accordion-layer">
      <Accordion defaultActiveKey="0">
        {props.cities.map(({ city, measurements }, i) => (
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
                  props.moreDetails(e);
                }}
              >
                More details
              </h5>
            </Accordion.Toggle>
            <Accordion.Collapse eventKey={i}>
              <Card.Body>
                {props.descriptions ? props.descriptions : 'No descriptions'}
              </Card.Body>
            </Accordion.Collapse>
          </Card>
        ))}
      </Accordion>
    </div>
  );
};

export default CityList;
