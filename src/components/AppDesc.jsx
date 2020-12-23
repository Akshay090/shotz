import React from "react";

const AppDesc = ({ openDir }) => {
  return (
    <div className="desc-wrapper">
      <p>
        <span>Shotz</span> - Lets you take screenshot in interval of 5 mimutes.
      </p>
      <p>
        All Screenshots are stored here :{" "}
        <span className="open" onClick={openDir}>
          Click to Open
        </span>
      </p>
    </div>
  );
};

export default AppDesc;
