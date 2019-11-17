import React from 'react';

const Header = props => {
  return (
    <div className="Header">
      <h2>
        <span>10 MOST </span>POLLUTED <span></span>{' '}
      </h2>
      <h6>
        {' '}
        Measurements include datas from listed countries of:
        <br />
        Poland <span>|</span>Germany<span>|</span> France <span>|</span>Spain
      </h6>
    </div>
  );
};

export default Header;
