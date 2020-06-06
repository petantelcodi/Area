// Libraries
import React from "react";
import DropdownTreeSelect from "./react-dropdown-tree-select/";

export default class SelectProperties extends React.Component {
    
    constructor(props) {
        super(props);
        this.state = {};
    }

    handleChange = selectedOption => {
        this.setState(
          { selectedOption },
          () => {
              //console.log('Option selected:', this.state.selectedOption.value);
              this.props.updateParam(this.state.selectedOption.value);
          }
        );
    };
    
    render(){

        const onChange = (currentNode, selectedNodes) => {
            console.log('onChange::', currentNode, selectedNodes)
            this.props.updateParam(currentNode.value);
        }
        
        const onAction = (node, action) => {
            console.log('onAction::', action, node)
        }

        const onNodeToggle = currentNode => {
            console.log('onNodeToggle::', currentNode)
        }
        console.log('data select: ',this.props.data);
        console.log('data select: ',JSON.stringify(this.props.data));
        // keepTreeOnSearch  onChange={onChange} onAction={onAction} onNodeToggle={onNodeToggle}

        if(this.props.items!==undefined){
        return (
            <div>
                <div className="filterSelectTitle">{this.props.text}:</div>
                <DropdownTreeSelect data={this.props.items}  mode="radioSelect" keepTreeOnSearch  onChange={onChange} onAction={onAction} onNodeToggle={onNodeToggle}/>
            </div>
        );
        }else{
            return (<div></div>);
        }
    }
}

// example group data: https://codesandbox.io/s/stacked-react-selects-s7l1l?file=/example.js