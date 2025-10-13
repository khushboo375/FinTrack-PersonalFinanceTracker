import React from 'react';
import "./styles.css";

function Button({ text, onClick, blue, black, disabled}) {
  let className = "btn";
  if (blue) className += " btn-blue";
  if (black) className += " btn-black"; // Optional: handles black buttons if needed

  return (
    <div className={className} onClick={onClick} disabled={disabled}>
      {text}
    </div>
  );
}

export default Button;
