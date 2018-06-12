import React from 'react';

const Coinbase = (props) => {
  return (
    <div style={{
      position: "absolute",
      top: 0,
      right: 0,
      display: "inline-block",
      padding: "0 10px",
      color: "white",
      fontSize: 12
    }}>
      Coinbase: {props.coinbase}
    </div>);
}

export default Coinbase;