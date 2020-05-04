// Libraries
import React from "react";
import { groupBy} from "lodash";
import _ from 'lodash';
import PubSub from "pubsub-js";
import {
    PopupboxManager,
    PopupboxContainer
} from 'react-popupbox';
import "react-popupbox/dist/react-popupbox.css"
// options: http://fraina.github.io/react-popupbox/

// Area components
import Groups from "./Groups";
import FilterList from "./FilterList";
import FilterForm from "./FilterForm";
import SimpleSelectProperties from "./SimpleSelectProperties";
import { OutputFileType } from "typescript";

export default class Area extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            param1 : "Reg",
            param2 : "Reg",
            filter: "",
        };
        console.log('call constructor=========================');
    }
    
    componentDidMount() {
        //PubSub.subscribe("filter-submit", this.onNewFilter);
    }
    
    addIdPropertyToAr(ar){
        var newArWithId = ar.map((x, i) => {
            x.id = i + 1;
            return x;
        });
        return newArWithId;
    }

    ObjToArSortedBySize(obj){ 
        return Object.keys(obj)
        .map(function(k) {
            return { key: k, value: obj[k] };
        })
        .sort(function(a, b) {
            return b.value.length - a.value.length;
        });
    }

    /*
    shouldComponentUpdate(nextProps, nextState) {
        console.log(nextProps, nextState)
        console.log('Greeting - shouldComponentUpdate lifecycle');
        return false;
    }
    */

    // Methods from Childs
    onNewFilter = (value) => {
        console.log('New filter:'+value);
        //this.filter = value;
        //this.state.filter = value;
        this.setState({filter:value});
        //this.render();
    }

    updateParam1 = (value) => {
        this.setState({param1: value})
    }

    updateParam2 = (value) => {
        this.setState({param2: value})
    }

    openPopupbox = (data) => {
        console.log(data);
        const content = (
          <div>
              {Object.keys(data).map((obj, i) => (
                <p>{obj} : {i}</p>
              ))}
          </div>
        )
        PopupboxManager.open({ content, config: {
            titleBar: {
              enable: true,
              text: 'Detail data'
            },
            overlayOpacity:0,
            fadeIn: true,
            fadeInSpeed: 500
        } })
    }
    
    render() {
        
        // Config variables
        var max_distinc = 50;
        var area_x = 790;
        var area_y = 600;
        var colors_approach = "fix"; // fix, random, gradient
        var area_title = "PeaceAgreements.org";
        
        var param1 = this.state.param1;
        var param2 = this.state.param2;
        var filter = this.state.filter;
        console.log("Current filter :",filter);

        var totalDataEntries = this.props.data.length;
        console.log('Total data length: ',totalDataEntries);

        var data = this.props.data;
        // Sort by date (From older to new)
        data = _.sortBy(  data, 'Dat' );
        // Add id to Array
        var dataWithId = this.addIdPropertyToAr(data);
        // Nesting Array  output obj with array in each property of the object
        var groupedByParam1 = groupBy(dataWithId, param1);
        // Delete property with same name as param1
        try{ delete groupedByParam1[param1]; }catch(err){}
        // Sort and 
        var groupedByParam1SortedBySize = this.ObjToArSortedBySize(groupedByParam1);
        // Sort by propety name
        var groupedByParam1SortedByName = _.sortBy( groupedByParam1SortedBySize, 'key' ); 

        // Calculate size group SVG
        var dim_groups = Math.sqrt(groupedByParam1SortedByName.length);
        if (dim_groups !== Math.floor(dim_groups)) {
            dim_groups = Math.floor(dim_groups) + 1;
        }
        var groupWidth = Math.floor(area_x / dim_groups);
        var groupHeight = Math.floor(area_y / dim_groups);

        // Calculate size block rect
        var maxBlocksInAGroup = groupedByParam1SortedBySize[0].value.length;
        console.log(groupedByParam1SortedBySize)
        console.log('maxBlocksInAGroup',maxBlocksInAGroup);
        var dim_block = Math.sqrt(maxBlocksInAGroup);
        if (dim_block !== Math.floor(dim_block)) {
            dim_block = Math.floor(dim_block) + 1;
        }
        var blockWidth = Math.floor((groupWidth ) / dim_block); // FIXMEE another corrector (!)
        var blockHeight = Math.floor((groupHeight) / dim_block); // FIXMEE another corrector (!)
        console.log('blockWidth: ',blockWidth);
        console.log('blockHeight: ',blockHeight);
        
        // Nesting param2 from data
        var groupedByParam2 = groupBy(dataWithId, param2);
        // Delete property with same name as param2
        try{ delete groupedByParam2[param2]; }catch(err){}
        // Array for colours
        var count = 0;
        Object.keys( groupedByParam2).map(function(key, index) {
            count = count+1;
            groupedByParam2[key] = count;
        });
        console.log(groupedByParam2["Africa excl MENA"]);
        console.log("groupedByParam2",groupedByParam2);
        console.log("groupedBy:", groupedByParam1);
        console.log("groupedBySorted:", groupedByParam1SortedByName);

        return (
            <div>
                <div className="filterArea">
                    <div className="filterSelect">
                        <SimpleSelectProperties updateParam={this.updateParam1} text="(blocks):" param="Reg"/>
                        <FilterList items={groupedByParam1} keyStr={"Param1"} />
                    </div>
                    <div className="filterSelect">
                        <SimpleSelectProperties updateParam={this.updateParam2} text="(Colours):" param="Reg"/>
                        <FilterList items={groupedByParam2} keyStr={"Param2"} />
                    </div>
                </div>
                <div className="vizArea">
                    <div className="groups">
                        <Groups
                        items={groupedByParam1SortedBySize}
                        colorAr={groupedByParam2}
                        param1={param1}
                        param2={param2}
                        filter={filter}
                        groupWidth={groupWidth}
                        groupHeight={groupHeight}
                        blockWidth={blockWidth}
                        blockHeight={blockHeight}
                        dim_block={dim_block}
                        openPopupbox={this.openPopupbox}
                        />
                    </div>
                    <div className="filterForInput">
                        <FilterForm onNewFilter={this.onNewFilter} filter={filter}/>
                    </div>
                </div>
                <PopupboxContainer />
            </div>
        );
    
    }

}