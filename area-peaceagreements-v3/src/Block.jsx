import React from "react";
import PubSub from "pubsub-js";
import Color from "color";

export default class Block extends React.Component {
  constructor() {
    super();
    this.state = {
      active: false,
      filter: '',
      // Color list for coloring param2
      colors: [
        "#CC5151",
        "#51CCCC",
        "#8ECC51",
        "#8E51CC",
        "#CCAD51",
        "#51CC70",
        "#5170CC",
        "#CC51AD",
        "#CC7F51",
        "#BCCC51",
        "#60CC51",
        "#51CC9E",
        "#519ECC",
        "#6051CC",
        "#BC51CC",
        "#9E1452",
        "#CFA2B0",
        "#CC9651",
        "#4BEC4E",
        "#E8FA14",
        "#1170DD",
        "#E8B080",
        "#694C33",
        "#D8A0CD",
        "#803D73",
        "DA8E95",
        "#831E27",
        "#A7B6BC",
        "#143E4D",
        "#9CF69C",
        "#267826",
        "#D3E19B",
        "#646D40",
        "#757575"
      ]
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
    this.props.openPopupbox(this.props.item);
  }

  render() {
    console.log('this.props.colorAr:',this.props.colorAr);

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

    var color = this.state.colors[this.props.colorAr[param2Value]];
    var colorFilter =  '#CCCCCC';
   
    // Makes lighter the ones not selected
    if(!foundFilter && this.props.filter!==""){
      color = Color(color).lighten(0.5).hex();
    }
    
    // Render
    return <rect ref={'block_'+this.props.groupId+'_'+this.props.item.id} x={my_x} y={my_y} stroke="#FFFFFF" className="block"  width={this.props.blockWidth} height={this.props.blockHeight} fill={color} onClick={this.showData} />;
  }
}

