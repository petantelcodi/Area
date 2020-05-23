// Import ----------------------------------------------
// React libraries
import React from "react";
import {
  BrowserRouter as Router,
} from "react-router-dom";

// Area components
import Area from "./Area"

// CSS
import "./reset.css";
import "./styles.css";

// Data
import data from "./data/data.json";
import cat_filters from "./data/config_filters.json";
import cat_hierarchy from "./data/cats-hierarchy.json";

export default function App() {

  return (
    <Router>
      <div className="Area">
        <Area data={data} cat_filters={cat_filters} cat_hierarchy={cat_hierarchy} />
      </div>
    </Router>
  );

}
