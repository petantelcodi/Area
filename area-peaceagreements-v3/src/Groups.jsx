import React from "react";
import Group from "./Group";
//import MaskLines from "./MaskLines";

//<LinesMask/>
const Groups = ({ items, colourData, param1, param2, groupWidth, groupHeight, blockWidth, blockHeight,dim_block }) => (
  <div id="area">
    {items.map((item, i) => (
      <div id={"group_"+i.toString()} key={"group_"+i.toString()} className="group">
        <p>{item.key}</p>
        <svg width={groupWidth} height={groupHeight} id={"#svg_group_"+i.toString()} position="relative">
          <Group
          items={item.value} 
          colourData={colourData}
          param2={param2} 
          blockWidth={blockWidth} 
          blockHeight={blockHeight}          
          dim_block={dim_block}
          groupWidth={groupWidth}
          />   
        </svg>     
      </div>
    ))}
  </div>
);

export default Groups;