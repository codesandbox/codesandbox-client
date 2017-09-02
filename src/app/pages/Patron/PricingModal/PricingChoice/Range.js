import React from "react";
import Slider from "rc-slider/lib/Slider";
import "rc-slider/assets/index.css";

export default props =>
  <Slider
    railStyle={{ background: "rgba(0, 0, 0, 0.3)", height: 12 }}
    trackStyle={{
      transition: "0.3s ease background-color",
      height: 12,
      background: props.color
    }}
    handleStyle={{
      height: 20,
      width: 20,
      borderRadius: "50%",
      background: "#ffffff",
      boxShadow: "0 2px 4px rgba(0, 0, 0, 0.5)",
      border: "none"
    }}
    {...props}
  />;
