import React from "react";
import Block from "./Block";

const Group = ({ items,colorAr, param2, filter, blockWidth, blockHeight,  columnsBlocks, rowsBlocks, openPopupbox,groupId }) => (
  <g>
    {items.map((item, index) => (
      <Block
        item={item}
        colorAr={colorAr}
        param2={param2}
        filter={filter}
        blockWidth={blockWidth}
        blockHeight={blockHeight}
        key={"block_" + item.id}
        index={index}
        columnsBlocks={columnsBlocks}
        rowsBlocks={rowsBlocks}
        openPopupbox={openPopupbox}
        groupId={groupId}
      />
    ))}
  </g>
);
//dim_block={dim_block}
//groupWidth={groupWidth}
export default Group;
