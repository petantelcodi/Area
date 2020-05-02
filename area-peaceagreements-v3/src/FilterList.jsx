/*
import React from "react";

export default class FilterList extends React.Component {
  constructor() {
    super();
    this.state = { active: false };
  }

  toggle = () => {
    this.setState(function(state, props) {
      return {
        active: !this.state.active
      };
    });
  };

  renderObj = () => {
    this.setState(function(state, props) {
      const links = props.items;
      var itemList = [];
      Object.keys(links).map((obj, i) => {
        console.log("===>", obj, i);
        //return <div key={i.toString()}>{obj.toString()}</div>;
        ///return( <div>{obj}</div> );
        itemList.push(obj);
      });
      return {itemList};
    });
  };

  render() {

    var itemList = this.renderObj();

    const Groups = ({ items, param1, param2, filter }) => (
      return(
      <div id="group1">
        <p>Group1</p>
        <Group items={items} filter={filter} param2={param2} />
      </div>
      );
    );

    //return( <div>list:{this.renderObj()}</div> );
  }
}

*/

import React from "react";

const FilterList = ({ items, keyStr }) => (
  <div>
    {Object.keys(items).map((obj, i) => (
      <div key={keyStr+i.toString()}>{obj}</div>
    ))}
  </div>
);

export default FilterList;