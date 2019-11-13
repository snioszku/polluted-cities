import React from "react";

function City(props) {
  return (
    <div className="cities">
      {props.cities.map(({ city, value, unit }, i) => (
        <div className="city" key={i}>
          {" "}
          <h3>{city}</h3>
          <p>
            Pollution level: <br />
            <br />
            <span>
              {value.toFixed(2)}
              {unit}
            </span>
          </p>
          <h5>More details</h5>
        </div>
      ))}
    </div>
  );
}

export default City;
