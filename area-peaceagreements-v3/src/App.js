// Import ----------------------------------------------
// React libraries
import React from "react";
import { groupBy } from "lodash";
// Area components
import Groups from "./Groups";
import FilterList from "./FilterList";
// CSS
import "./styles.css";
// Data
import data from "./data/data.json";
import config_filters from "./data/config_filters.json";

// -----------------------------------------------------
class Filter extends React.Component {
  render() {
    // Config variables
    var max_distinc = 50;
    var area_x = 1100;
    var area_y = 900;
    var colors_approach = "fix"; // fix, random, gradient
    var area_title = "PeaceAgreements.org";
    var param1 = "Reg";
    var param2 = "Reg";
    var filter = "human";

    // Add Id to data
    var dataWithId = data.map((x, i) => {
      x.id = i + 1;
      return x;
    });
    // Nesting the array
    var groupedByParam1 = groupBy(dataWithId, param1);
    // Delete property with same name as param1
    try{ delete groupedByParam1[param1]; }catch(err){}
    // Sort and 
    var groupedByParam1SortedBySize = Object.keys(groupedByParam1)
      .map(function(k) {
        return { key: k, value: groupedByParam1[k] };
      })
      .sort(function(a, b) {
        return b.value.length - a.value.length;
      });
    // Sort  
    var groupedByParam1SortedByName = groupedByParam1SortedBySize ;

    // Calculate size group svg
    var dim_groups = Math.sqrt(groupedByParam1SortedByName.length);
    if (dim_groups !== Math.floor(dim_groups)) {
      dim_groups = Math.floor(dim_groups) + 1;
    }
    var groupWidth = Math.floor(area_x / dim_groups);
    var groupHeight = Math.floor(area_y / dim_groups);

    // Calculate size block rect
    var maxBlocksInAGroup = groupedByParam1SortedBySize[0].value.length;
    console.log(groupedByParam1SortedBySize)
    console.log('maxBlocksInAGroup',maxBlocksInAGroup);
    var dim_block = Math.sqrt(maxBlocksInAGroup);
    if (dim_block !== Math.floor(dim_block)) {
      dim_block = Math.floor(dim_block) + 1;
    }
    var blockWidth = Math.floor((groupWidth ) / dim_block); // FIXMEE another corrector (!)
    var blockHeight = Math.floor((groupHeight) / dim_block); // FIXMEE another corrector (!)
    console.log('blockWidth: ',blockWidth);
    console.log('blockHeight: ',blockHeight);

    // Nesting param2 from data
    var groupedByParam2 = groupBy(dataWithId, param2);
    // Delete property with same name as param2
    try{delete groupedByParam2[param2];}catch(err){}
    console.log("groupedBy:", groupedByParam1);
    console.log("groupedBySorted:", groupedByParam1SortedByName);

    return (
      <div>
        <FilterList items={groupedByParam1} keyStr={"Param1"} />
        <FilterList items={groupedByParam2} keyStr={"Param2"} />
        <Groups
          items={groupedByParam1SortedByName}
          colourData={groupedByParam2}
          param1={param1}
          param2={param2}
          filter={filter}
          groupWidth={groupWidth}
          groupHeight={groupHeight}
          blockWidth={blockWidth}
          blockHeight={blockHeight}
          dim_block={dim_block}
        />
      </div>
    );
  }
}

export default function Area() {
  return (
    <div className="Area">
      <Filter items={data} />
    </div>
  );
}
