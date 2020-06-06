import React from "react";

export default class FilterForm extends React.Component {
    constructor(props) {
      super(props);
      this.state = {value: ''};
      this.handleChange = this.handleChange.bind(this);
      this.handleSubmit = this.handleSubmit.bind(this);

      this.setState({value:this.props.filter});
    }
 
    handleChange(event) {
      //console.log("== Change form:"+event.target.value);
      this.setState({value: event.target.value});
    }
  
    handleSubmit(event) {
      this.props.onNewFilter(this.state.value);
      event.preventDefault();
    }

    render() {
      //console.log('== render form filter');
      return (
     
        <form className="inputFilterForm" onSubmit={this.handleSubmit}>
          <label>
            
            <input type="text" value={this.state.value} onChange={this.handleChange} />
          </label>
          <input type="submit" value="Filter" />
        </form>
        
      );
    }
  }
  