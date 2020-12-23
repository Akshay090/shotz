import React from "react";

const Btn = ({ text, ...props }) => {
  return (
    <button className="btn" {...props}>
      {text}
    </button>
  );
};

export default Btn;
