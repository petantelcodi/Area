// Libraries
import React from "react";
import { groupBy} from "lodash";
import _ from 'lodash';
//import PubSub from "pubsub-js";
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

// Data & configs
import Config from "./Config"
//import catHierarchy from "./data/cats-hierarchy.json"
import catHierarchy from "./data/cats-hierarchy-select.json"
import config_filters from "./data/config_filters.json"

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
        console.log('Call constructor=========================');

        console.log('mounted ');

        
        /*
        var selectFilterAr = []
        var mainCatHierarchyAr = catHierarchy["cat hierarchy"];
        for( let i=0; i<mainCatHierarchyAr.length; i++ ){
            var objName = Object.keys(mainCatHierarchyAr[i])[0];

            var children = mainCatHierarchyAr[i][objName];
            var obj = {'label':objName, "children":[]}
            if(children.length>0) obj.expandOnly = true;
     
            for( let j=0; j<children.length; j++ ){
                var objLevel1 = {};
                if(_.isObject(mainCatHierarchyAr[i][objName][j])){
                    var objNameLevel1 = Object.keys(mainCatHierarchyAr[i][objName][j])[0];
                    var childrenLevel1 = mainCatHierarchyAr[i][objName][j][objNameLevel1];
                    objLevel1 = {'label':objNameLevel1, "children":[]}
                    if(childrenLevel1.length>0) objLevel1.expandOnly = true;
                    for( let k=0; k<childrenLevel1.length; k++ ){
                        if(_.isObject(mainCatHierarchyAr[i][objName][j])){
                            var objNameLevel2 = Object.keys(mainCatHierarchyAr[i][objName][j][objNameLevel1][k])[0];
                            var childrenLevel2 = mainCatHierarchyAr[i][objName][j][objNameLevel1][k][objNameLevel2];
                            var objLevel2 = {'label':objNameLevel1, "children":[]}
                            console.log("childrenLevel2.length :",childrenLevel2.length)
                            //if(childrenLevel2.length>0) objLevel2.expandOnly = true;
                        }else{

                        }
                        objLevel1.children.push(objLevel2);
                    }
                }else{
                    objLevel1 = {'label':mainCatHierarchyAr[i][objName][j]};
                }
                obj.children.push(objLevel1);
            }
            console.log('obj cat',obj)
            selectFilterAr.push(obj);
            
        }*/
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

    getHumanFromID= (id) => {
        var output = null;
        try{
            output =  config_filters[0][id].human
        }catch(err){
            output = id;
            console.log("Error ::: looking for Human :::", output);
        }
        return output;
    }

    getDistincFromID= (id) => {
        var output = null;
        try{
            output =  config_filters[0][id].distincnum
        }catch(err){
            output = id;
            console.log("Error ::: looking for Distincnum :::", output);
        }
        return output;
    }

    createSelectJson = (ar,param) => {
        // clone multidimentional array (which is tricky)
        var selectObj = JSON.parse(JSON.stringify(catHierarchy.cat_hierarchy));
           
        for(let i=0;i<selectObj.length;i++){
            // check if is selected
            if(selectObj[i].value === param ){
                console.log('selected tag',selectObj[i].value , param);
                selectObj[i].isDefaultValue = true;
            }
            //if(selectObj[i].children=== undefined || selectObj[i].children.length==0) continue;
            var totalItemsLevel1 = 0;
            try{
                totalItemsLevel1 =selectObj[i].children.length
            }catch(err){}
            for(let j=0;j<totalItemsLevel1;j++){
                //
                if(selectObj[i].children[j].label==='' || selectObj[i].children[j].label===undefined ){
                    let id =  selectObj[i].children[j].value;
                    console.log('value: ',this.getHumanFromID(id));
                    if( id!==undefined && id!=="" ) selectObj[i].children[j].label = this.getHumanFromID(id);
                    if(this.getDistincFromID(id)>Config.MAX_DISTINC) selectObj[i].children[j].hide = true;
                }
                if(selectObj[i].children[j].value === param ){
                    console.log('selected tag',selectObj[i].children[j].value , param)
                    selectObj[i].children[j].isDefaultValue = true;
                    selectObj[i].expanded = true;
                }
                
                //if(selectObj[i].children[j].children===undefined || selectObj[i].children[j].children.length==0) continue;
                var totalItemsLevel2 = 0;
                try{
                    totalItemsLevel2 = selectObj[i].children[j].children.length
                }catch(err){}

                for(let h=0; h<totalItemsLevel2; h++){
                    if(selectObj[i].children[j].children[h].label==='' || selectObj[i].children[j].children[h].label===undefined){
                        let id =  selectObj[i].children[j].children[h].value;
                        selectObj[i].children[j].children[h].label = this.getHumanFromID(id);
                        if(this.getDistincFromID(id)>Config.MAX_DISTINC) selectObj[i].children[j].children[h].hide = true;
                    }
                    if(selectObj[i].children[j].children[h].value === param ){
                        selectObj[i].children[j].children[h].isDefaultValue = true;
                        selectObj[i].expanded = true;
                        selectObj[i].children[j].expanded = true;
                    }
                }
            }  
        }
        return selectObj;
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

        //selectObj
        var urlParam1,urlParam2,urlFilter;
        try{
            
            //var urlParam1 = this.props.match.params.number;
            //console.log("===> url:",url);

            var urlParam1 = this.props.match.params.param1;
            var urlParam2 = this.props.match.params.param2;
            var urlFilter = this.props.match.params.filter;
            console.log("===> url param:",urlParam1,urlParam2,urlFilter); 
            
        }catch(err){console.log("====> url: ERROR",this.props );}
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
        var param1 = urlParam1!==undefined? urlParam1:this.state.param1;
        var param2 = urlParam2!==undefined? urlParam2:this.state.param2;
        var filter = urlFilter!==undefined? urlFilter:this.state.filter;

        var selectObjParam1 = this.createSelectJson(catHierarchy.cat_hierarchy,param1);
        console.log("selectObjParam1",param1,selectObjParam1);
        var selectObjParam2 = this.createSelectJson(catHierarchy.cat_hierarchy,param2);
        console.log("selectObjParam2",param2,selectObjParam2);

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
                        <SelectProperties updateParam={this.updateParam1} items={selectObjParam1}  text="Blocks"/>
                        <FilterList items={groupedByParam1} keyStr={"Param1"} />
                    </div>
                    <div className="filterSelect">
                        <SelectProperties updateParam={this.updateParam2} items={selectObjParam2} text="Colours"/>
                        <FilterListColours items={groupedByParam2} keyStr={"Param2"} />
                    </div>
                </div>
                <div className="filterAreaSearch">
                    <FilterForm onNewFilter={this.onNewFilter} filter={filter}/>
                    <div className="detailInfo"><p>{filter!==''?<span style={{color:'yellow'}}>Filter "{filter}" has {totalFoundFilter} documents &#124; </span>:null} Number of documents: {totalDataEntries}<br/></p></div>
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