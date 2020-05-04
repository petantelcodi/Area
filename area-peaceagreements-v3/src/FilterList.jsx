import React from "react";

const FilterList = ({ items, keyStr }) => (
  <div>
    {Object.keys(items).map((obj, i) => (
      <div key={keyStr+i.toString()} className="filterSelectProperties">{obj}</div>
    ))}
  </div>
);

export default FilterList;