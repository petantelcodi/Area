import React from "react";
import PubSub from 'pubsub-js';

export default class FilterForm extends React.Component {
    constructor(props) {
      super(props);
      this.state = {value: ''};
      this.handleChange = this.handleChange.bind(this);
      this.handleSubmit = this.handleSubmit.bind(this);
    }

    componentDidMount() {
      //console.log("== Add to form:"+this.props.filter);
      this.setState({value:this.props.filter});
    }
  
    handleChange(event) {
      //console.log("== Change form:"+event.target.value);
      this.setState({value: event.target.value});
    }
  
    handleSubmit(event) {
      //PubSub.publish("filter-submit", this.state.value);
      this.props.onNewFilter(this.state.value);
      //this.props.parent.state.filter = this.state.value;
      event.preventDefault();
    }

    /*
    shouldComponentUpdate(nextProps, nextState) {
      console.log(nextProps, nextState)
      console.log('Greeting - shouldComponentUpdate lifecycle');
      return false;
    }
    */

    render() {
      //console.log('== render form filter');
      return (
     
        <form onSubmit={this.handleSubmit}>
          <label>
            
            <input type="text" value={this.state.value} onChange={this.handleChange} />
          </label>
          <input type="submit" value="Filter" />
        </form>
        
      );
    }
  }
  