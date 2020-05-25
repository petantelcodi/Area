// Libraries
import React from "react";
//import Select from 'react-select-reborn';
import DropdownTreeSelect from "./react-dropdown-tree-select/index";
import basicCat from "./data/basicCat.json";

export default class SelectProperties extends React.Component {
    
    constructor(props) {
        super(props);
        this.state = {};
    }

    componentDidMount() {
        
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

        return (
            <div>
                <DropdownTreeSelect data={basicCat} keepTreeOnSearch mode="radioSelect" onChange={onChange} onAction={onAction} onNodeToggle={onNodeToggle} />
                <div className="selectDescription">{this.props.text}</div>
            </div>
        );
    }
}

// example group data: https://codesandbox.io/s/stacked-react-selects-s7l1l?file=/example.js