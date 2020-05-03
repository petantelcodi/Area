import React from "react";
import Block from "./Block";

const Group = ({ items, param2, blockWidth, blockHeight, dim_block, groupWidth }) => (
  <g>
    {items.map((item, index) => (
      <Block
        item={item}
        param2={param2}
        blockWidth={blockWidth}
        blockHeight={blockHeight}
        key={"block_" + item.id}
        index={index}
        dim_block={dim_block}
        groupWidth={groupWidth}
      />
    ))}
  </g>
);

export default Group;
