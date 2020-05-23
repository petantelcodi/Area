import React from "react";
import PubSub from "pubsub-js";
import Color from "color";

import Config from "./Config"

export default class Block extends React.Component {
  constructor() {
    super();
    this.state = {
      active: false,
      filter: '',
      // Color list for coloring param2
      colors: Config.colorList
    };
  }

  toggle = () => {
    this.setState(function(state, props) {
      return {
        active: !this.state.active
      };
    });
  };


  // AgtId
  // colourData -> array for the colours

  componentDidMount() {
    //console.log('block mount again')
    //this.setState({filter:this.props.filter});
  }

  showData = () =>{
    //alert(JSON.stringify(this.props.items));
    //console.log(JSON.stringify(this.props.items));
    //console.log(this.props.item);
    //this.props.openPopupbox(this.props.item);
  }

  render() {
    
    // Find position block
    var index = this.props.index;
    //console.log('== index:', index,' dim_block:',this.props.dim_block );
    //console.group('this.props.dim_block',this.props.dim_block);
    var n = index /  this.props.dim_block;
    //console.log('n:', n );
    var my_x = this.props.blockWidth * ( index % Math.floor(this.props.groupWidth/this.props.blockWidth));
    //console.log('n % 1',n % 1);
    
    var  my_y = Math.floor(n) * this.props.blockHeight;
    //console.log('my_x :',my_x)
    //console.log('my_y :',my_y)
    
    // Search filter in
    var foundFilter = false;
    
    if(this.props.filter!==""){
      
      //console.log('filter:',this.props.filter);

      Object.entries(this.props.item).forEach(([key, value]) => {
        //console.log(value);
        if(typeof value === 'string' && value.toLowerCase().indexOf(this.props.filter.toLowerCase())!==-1){ 
          foundFilter = true;
          //console.log("== foundFilter :",value);
        } 
      });
    }

    // Set color
    var param2 = this.props.param2;
    var param2Value = this.props.item[param2];
    //console.log('param2Value:',param2Value);
    //console.log('this.props.colourData:',this.props.colourData);
    //console.log('this.props.colorAr:',this.props.colorAr);
    var colorArId = this.props.colorAr[param2Value]-1;
    console.log('colorArId: ',colorArId);
    var color = this.state.colors[colorArId];
    var colorFilter =  '#CCCCCC';
   
    var opacity = 1;
    // Makes lighter the ones not selected
    if(!foundFilter && this.props.filter!==""){
      //color = Color(color).alpha(0.8).lighten(0.5).hex();
      //opacity = 0.5;
      //color = colorFilter;
    }
    // Render
    return <g>
      <rect ref={'block_rect_'+this.props.groupId+'_'+this.props.item.id} x={my_x} y={my_y} stroke="#000000" className="block"  width={this.props.blockWidth} height={this.props.blockHeight} fill={color} onClick={this.showData} />
      {foundFilter && this.props.filter!==""?<g><line x1={my_x} y1={my_y} x2={my_x+this.props.blockWidth} y2={my_y+this.props.blockHeight} className="lineBlockCross" /><line x1={my_x} y1={my_y+this.props.blockHeight} x2={my_x+this.props.blockWidth} y2={my_y} className="lineBlockCross"  /></g>:null}
      </g>;
  }
}

