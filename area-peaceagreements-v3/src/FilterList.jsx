import React from "react";

const FilterList = ({ items, keyStr }) => (
  <div>
    {Object.keys(items).map((obj, i) => (
      <div key={keyStr+i.toString()}>{obj}</div>
    ))}
  </div>
);

export default FilterList;