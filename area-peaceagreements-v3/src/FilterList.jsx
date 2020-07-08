import React from "react";

const FilterList = ({ items, keyStr }) => (
  <div className="leftText">
    {
    items["undefined"]!==undefined?
    <span className="textNoExist">Please, choose a parameter</span>
    :
    Object.keys(items).map((obj, i) => (
      <div key={keyStr+i.toString()} className="filterSelectProperties">{obj}</div>
    ))
    }

  </div>
);

export default FilterList;