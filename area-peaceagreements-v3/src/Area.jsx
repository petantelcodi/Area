// Libraries
import React from "react";
import { groupBy} from "lodash";
import _ from 'lodash';
import PubSub from "pubsub-js";
import {useParams, withRouter} from "react-router-dom";
import {useLocation} from "react-router-dom";
import queryString from 'query-string';

/*import {
    PopupboxManager,
    PopupboxContainer
} from 'react-popupbox';
import "react-popupbox/dist/react-popupbox.css"
*/
// options: http://fraina.github.io/react-popupbox/

// Area components
import Groups from "./Groups";
import FilterList from "./FilterList";
import FilterListColours from "./FilterListColours";
import FilterForm from "./FilterForm";
import SelectProperties from "./SelectProperties";
import { OutputFileType } from "typescript";

import Config from "./Config"
import dataPAsim from "./data/PAsim.json";
import dataCFsim from "./data/CFsim.json";
import dataPA from "./data/PA.json";
import dataCF from "./data/CF.json";

export default class Area extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            param1 : Config.PARAM1,
            param2 : Config.PARAM2,
            filter: "",
            typeArea:Config.START_TYPE_AREA
        };
        console.log('call constructor=========================');
    }
    
    componentDidMount() {
        //let query = this.useQuery();
        //console.log('this.props.location.search:',this.props.location);
        //console.log(query);
        
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

    ObjToAr(obj){ 
        return Object.keys(obj)
        .map(function(k) {
            return { key: k, value: obj[k] };
        })
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

    areaTypeSelect = (value) => {
        console.log('areaTypeSelect : ',value);
        this.setState({typeArea: value})
    }
    /*
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
    */
    render() {
        // exemple https://codesandbox.io/s/react-router-query-parameters-mfh8p?from-embed=&file=/example.js
        //let query = new URLSearchParams(useLocation().search);

        // Config variables
        const max_distinc = Config.MAX_DISTINC;
        const area_x = Config.AREAX;
        const area_y = Config.AREAY;
        const colors_approach = Config.COLORS_APPROACH; 
        var area_title = "PeaceAgreements.org";

        var typeArea = this.state.typeArea;
        var data = [];
        console.log("typeArea",typeArea)
        switch(typeArea){
            case 'CF-Simple':
                data = dataCFsim;
                console.log('CF-Simple');
                break;
            case 'PA-Simple':
                data = dataPAsim;
                console.log('PA-Simple');
                break;
            case 'PA-Detailed':
                data = dataPA;
                console.log('PA-Detailed');
                break;
            case 'CF-Detailed':
                data = dataCF;
                console.log('CF-Detailed');
                break;     
        }
        
        //const values = queryString.parse(this.props.location.search)
        //console.log(values)
        var param1 = this.state.param1;
        var param2 = this.state.param2;
        var filter = this.state.filter;
        
        console.log("Current filter :",filter);

        var totalDataEntries = data.length;//this.props.data.length;
        console.log('Total data length: ',totalDataEntries);

        //var data = this.props.data;
        // Sort by date (From older to new)
        data = _.sortBy(  data, 'Dat' );
        // Add id to Array
        var dataWithId = this.addIdPropertyToAr(data);

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

        // Nesting Array  output obj with array in each property of the object
        var groupedByParam1 = groupBy(dataWithId, param1);
        // Delete property with same name as param1
        try{ delete groupedByParam1[param1]; }catch(err){}
        // Sort and 
        var groupedByParam1SortedBySize = this.ObjToArSortedBySize(groupedByParam1);

        // Sort by colour group and year
        var totalFoundFilter = 0;
        for(let i=0; i<groupedByParam1SortedBySize.length; i++ ){
            var myObject = groupBy(groupedByParam1SortedBySize[i].value, param2);
            console.log('myObject: ',myObject)

            // Get object in order of object that is in menu
            var myObjectSorted = {};
            Object.keys( groupedByParam2).map(function(key, index) {
                myObjectSorted[key] = myObject[key];
            }); 
            
            var arSorted = this.ObjToAr(myObjectSorted);
            console.log('ArSorted: ',arSorted);
            var outAr = [];
            for(let j=0; j<arSorted.length; j++){
                var sortedAr = _.sortBy(  arSorted[j].value, 'Dat' );
                // Sort for find if has filter
                var foundFilter = false;
                if(this.props.filter!=="" && sortedAr.length>0){
                    //console.log('filter:',this.props.filter);
                    console.log('sortedAr[0]: ',sortedAr)
                    
                    for(let k=0; k<sortedAr.length; k++){
                        sortedAr[k].foundFilter = false;
                        Object.entries(sortedAr[k]).forEach(([key, value]) => {
                            //console.log(value, typeof value)
                            if(typeof value === 'string' && !(value==="0") && !(value==="1") && value.toLowerCase().indexOf(filter.toLowerCase())!==-1){ 
                                sortedAr[k].foundFilter = true;
                                totalFoundFilter +=1;
                            } 
                        });
                    }
                    
                }
                // add to mergeAr
                outAr = outAr.concat(sortedAr);
                //console.log('Sortby ArSorted: ',outAr.length, sortedAr);
            }
            // Obj to Ar
            groupedByParam1SortedBySize[i].value = outAr;
            
        }
        // Sort by propety name
        var groupedByParam1SortedByName = _.sortBy( groupedByParam1SortedBySize, 'key' ); 

        // Calculate size group SVG
        var dim_groups = Math.sqrt(groupedByParam1SortedByName.length);
        if (dim_groups !== Math.floor(dim_groups)) {
            dim_groups = Math.floor(dim_groups) +1;//+ 1
        }
        var groupWidth = Math.floor(area_x / dim_groups);
        var groupHeight = Math.floor(area_y / dim_groups);

        // Calculate size block rect
        var maxBlocksInAGroup = groupedByParam1SortedBySize[0].value.length;
        console.log('groupedByParam1SortedBySize:',groupedByParam1SortedBySize)
        console.log('maxBlocksInAGroup',maxBlocksInAGroup);
        var dim_block = Math.sqrt(maxBlocksInAGroup);
        if (dim_block !== Math.floor(dim_block)) {
            dim_block = Math.floor(dim_block) + 1;
        }
        var blockWidth = Math.floor((groupWidth ) / dim_block); // FIXMEE another corrector (!)
        var blockHeight = Math.floor((groupHeight) / dim_block); // FIXMEE another corrector (!)
        console.log('blockWidth: ',blockWidth);
        console.log('blockHeight: ',blockHeight);
        
        
        console.log(groupedByParam2["Africa excl MENA"]);
        console.log("groupedByParam2",groupedByParam2);
        console.log("groupedBy:", groupedByParam1);
        console.log("groupedBySorted:", groupedByParam1SortedByName);

        return (
            <div>
                <div className="typeAreaSelect">
                    <div className={typeArea==='PA-Simple'?"typeAreaBtSelect typeAreaBtSelected":"typeAreaBtSelect"} onClick={()=>{this.areaTypeSelect('PA-Simple')}}>PA-Simple</div> 
                    <div className={typeArea==='PA-Detailed'?"typeAreaBtSelect typeAreaBtSelected":"typeAreaBtSelect"} onClick={()=>{this.areaTypeSelect('PA-Detailed')}}>PA-Detailed</div> 
                    <div className={typeArea==='CF-Simple'?"typeAreaBtSelect typeAreaBtSelected":"typeAreaBtSelect"} onClick={()=>{this.areaTypeSelect('CF-Simple')}}>CF-Simple</div> 
                    <div className={typeArea==='CF-Detailed'?"typeAreaBtSelect typeAreaBtSelected":"typeAreaBtSelect"} onClick={()=>{this.areaTypeSelect('CF-Detailed')}}>CF-Detailed</div>
                </div>
                <div className="descriptionArea">
                    <div>{Config.DESCRIPTION[typeArea]}</div>
                </div>
                <div className="filterArea">
                    <div className="filterSelect">
                        <SelectProperties updateParam={this.updateParam1} text="(blocks):" param="Reg"/>
                        <FilterList items={groupedByParam1} keyStr={"Param1"} />
                    </div>
                    <div className="filterSelect">
                        <SelectProperties updateParam={this.updateParam2} text="(Colours):" param="Reg"/>
                        <FilterListColours items={groupedByParam2} keyStr={"Param2"} />
                    </div>
                </div>
                <div className="filterAreaSearch">
                    <FilterForm onNewFilter={this.onNewFilter} filter={filter}/>
                    <div className="detailInfo"><p>{filter!==''?<span style={{color:'yellow'}}>Filter documents: {totalFoundFilter} &#124; </span>:null} Number of documents: {totalDataEntries}<br/></p></div>
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
                    
                </div>
                
            </div>
        );
    
    }

}