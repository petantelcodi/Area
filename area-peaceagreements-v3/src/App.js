// Import ----------------------------------------------
// React libraries
import React from "react";
import {
  BrowserRouter, Switch,Route
} from "react-router-dom";

// Area components
import Area from "./Area"



// Data
//import data from "./data/data.json";
//import cat_filters from "./data/config_filters.json";
//import cat_hierarchy from "./data/cats-hierarchy.json";

export default function App() {

//<Route path='/index.html?/:typeArea?/:param1?/:param2?/:filter?' component={Area}/>
  return (
    <BrowserRouter>
      <Switch>
      <div className="Area">
      <Route exact path='/' component={Area}/> 
      </div>
      </Switch>
    </BrowserRouter>
  );

}
