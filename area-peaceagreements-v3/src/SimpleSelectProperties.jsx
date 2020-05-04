// Libraries
import React from "react";
import Select from 'react-select';
import basicCat from "./data/basicCat.json";

export default class SimpleSelectProperties extends React.Component {
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
        /*
        const reactSelectStyles = {
            container: (provided, state) => ({
                ...provided,
                padding: 0,
                background: '#555',
                height: 'fit-content'
            }),
            control: (provided, state) => ({
                ...provided,
                borderWidth: 0,
                minHeight: 'fit-content',
                height: 'fit-content'
            }),
            indicatorsContainer: (provided, state) => ({
                ...provided,
                height: '29px'
            }),
            input: (provided, state) => ({
                ...provided,
                height: '21px'
            }),
            menuPortal: base => ({ ...base, zIndex: 9999 }),
            menu: provided => ({ ...provided, zIndex: "9999 !important" })
        };
        */
       const customStyles = {
        option: (base, state) => ({
          ...base,
          color: '#999',
          overflowY: 'scroll'
          
          // You can also use state.isFocused to conditionally style based on the focus state
        })
      };

        return (
            <div>
                <Select
                defaultValue={basicCat[4]}
                onChange={this.handleChange}
                options={basicCat}
                className="selectSimple"  
                theme={theme => ({
                    ...theme,
                    borderRadius: 0,
                    colors: {
                      ...theme.colors,
                      primary25: 'grey',
                      primary: 'black',
                    },
                  })}
                styles={customStyles}
                />
                <div className="selectDescription">{this.props.text}</div>
            </div>
        );
    }
}

// example group data: https://codesandbox.io/s/stacked-react-selects-s7l1l?file=/example.js