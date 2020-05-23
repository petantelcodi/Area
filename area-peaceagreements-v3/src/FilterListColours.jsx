import React from "react";
import Config from "./Config"

const FilterListColours = ({ items, keyStr }) => (
  <div>
    {Object.keys(items).map((obj, i) => (
      <div key={keyStr+i.toString()} className="filterSelectProperties" style={{'background-color':Config.colorList[i]}}>{obj}</div>
    ))}
  </div>
);

export default FilterListColours;