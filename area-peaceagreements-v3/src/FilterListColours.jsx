import React from "react";
import Config from "./Config"

const FilterListColours = ({ items, keyStr }) => (
  <div>
      {
      items["undefined"]!==undefined?
      <span className="textNoExist">Please, choose a parameter</span>
      :
      Object.keys(items).map((obj, i) => (
        <div key={keyStr+i.toString()} className="filterSelectProperties" style={{'backgroundColor':Config.colorList[i],'border':'none'}}>{obj}</div>
      ))
      }
  </div>
);

export default FilterListColours;

