import React from "react";
import Group from "./Group";
//import MaskLines from "./MaskLines";

//<LinesMask/>
const Groups = ({ items, colorAr, param1, param2, filter, groupWidth, groupHeight, blockWidth, blockHeight, columnsBlocks,rowsBlocks, openPopupbox }) => (
  <div id="AreaGroups">
    {items.map((item, i) => (
      <div id={"group_"+i.toString()} key={"group_"+i.toString()} className="group">
        <div className="titleGroups">{item.key} <span className="titleGroupNumbers">[{item.value.length}]</span></div>
        <svg width={groupWidth} height={groupHeight} id={"#svg_group_"+i.toString()} position="relative">
          <Group
          items={item.value} 
          colorAr={colorAr}
          param2={param2}
          filter={filter} 
          blockWidth={blockWidth} 
          blockHeight={blockHeight}          
          columnsBlocks={columnsBlocks}
          rowsBlocks={rowsBlocks}
          openPopupbox={openPopupbox}
          groupId={i}
          />   
        </svg>     
      </div>
    ))}
  </div>
);
//groupWidth={groupWidth}
export default Groups;