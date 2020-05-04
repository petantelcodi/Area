// Import ----------------------------------------------
// React libraries
import React from "react";

// Area components
import Area from "./Area"

// CSS
import "./styles.css";

// Data
import data from "./data/data.json";
import cat from "./data/config_filters.json";
import cat_hierarchy from "./data/cats-hierarchy.json";

export default function App() {
  
  return (
    <div className="Area">
      <Area data={data} cat_filters={cat} cat_hierarchy={cat_hierarchy} />
    </div>
  );

}
