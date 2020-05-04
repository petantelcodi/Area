import React from "react";
import Group from "./Group";
//import MaskLines from "./MaskLines";

//<LinesMask/>
const Groups = ({ items, colorAr, param1, param2, filter, groupWidth, groupHeight, blockWidth, blockHeight, dim_block, openPopupbox }) => (
  <div id="AreaGroups">
    {items.map((item, i) => (
      <div id={"group_"+i.toString()} key={"group_"+i.toString()} className="group">
        <p>{item.key}</p>
        <svg width={groupWidth} height={groupHeight} id={"#svg_group_"+i.toString()} position="relative">
          <Group
          items={item.value} 
          colorAr={colorAr}
          param2={param2}
          filter={filter} 
          blockWidth={blockWidth} 
          blockHeight={blockHeight}          
          dim_block={dim_block}
          groupWidth={groupWidth}
          openPopupbox={openPopupbox}
          groupId={i}
          />   
        </svg>     
      </div>
    ))}
  </div>
);

export default Groups;