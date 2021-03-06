import React from "react";

const SquareImage = ({src, ...props}) => {
  var style = {
    color: 'white',
    background: "no-repeat center/cover",
    backgroundImage: `url(${src})`,
    width: "100%",
    height: 0,
    paddingBottom: "100%"
  };

  return (
    <div {...props}>
      <div style={style}></div>
    </div>
  )
}

export default SquareImage;
