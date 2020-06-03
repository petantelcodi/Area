// Import ----------------------------------------------
// React libraries
import React from "react";
import {
  BrowserRouter, Switch,Route
} from "react-router-dom";

// Area components
import Area from "./Area"

// CSS
import "./reset.css";
import "./styles.css";

// Data
//import data from "./data/data.json";
//import cat_filters from "./data/config_filters.json";
//import cat_hierarchy from "./data/cats-hierarchy.json";

export default function App() {
//<Area data={data} cat_filters={cat_filters} cat_hierarchy={cat_hierarchy} />
  return (
    <BrowserRouter>
      <Switch>
      <div className="Area">
      <Route exact path='/' component={Area}/>
      <Route path='/p/:param1?/:param2?/:filter?' component={Area}/>
      </div>
      </Switch>
    </BrowserRouter>
  );

}
