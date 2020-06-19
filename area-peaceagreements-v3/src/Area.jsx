// Libraries
import React from "react";
import { groupBy} from "lodash";
import _ from 'lodash';
import { Redirect} from "react-router-dom";
import { useHistory } from "react-router-dom";

import {
    PopupboxManager,
    PopupboxContainer
} from 'react-popupbox';

// CSS
import "./reset.css";
import "react-popupbox/dist/react-popupbox.css"
import "./styles.css";

// options: http://fraina.github.io/react-popupbox/

// Area components
import Groups from "./Groups";
import FilterList from "./FilterList";
import FilterListColours from "./FilterListColours";
import FilterForm from "./FilterForm";
import SelectProperties from "./SelectProperties";

// Data & configs
import Config from "./Config"
import catHierarchy from "./data/cats-hierarchy-select.json"
import catHierarchy_simple from "./data/cats-hierarchy-select-simple.json"
import config_filters from "./data/config_filters.json"
import config_filters_simple from "./data/config_filters_simple.json"

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
            update: false,
            filter: "",
            typeArea: Config.START_TYPE_AREA,
            separatorForArbitrarySortingValues: Config.SEPARATOR_FOR_ARBITRARY_SORTING_VALUES
        };
        console.log('Call constructor=========================');
        console.log('mounted ');
    }
    
    addIdPropertyToAr(ar){
        var newArWithId = ar.map((x, i) => {
            // Add id
            x.id = i + 1;
            // Clean properties value 
            let value = x[this.state.param2];
            //console.log('test:',value);
            try{
                if(value.split(this.state.separatorForArbitrarySortingValues).length===2) value = value.split(this.state.separatorForArbitrarySortingValues)[1];
            }catch(err){}
            x[this.state.param2] = value;
            return x;
        });
        return newArWithId;
    }

    sortObjKeysAlphabetically(obj){ 
        var count = 0;
        const keys = Object.keys(obj).sort();
        console.log(keys,keys.length );
        let objTemp = {};
        for(var i = 0; i< keys.length;i++){
            count = count+1;
            let key = keys[i];
            try{
                if(key.split(this.state.separatorForArbitrarySortingValues).length===2) key = key.split(this.state.separatorForArbitrarySortingValues)[1];
            }catch(err){}
            objTemp[key] = count;
        }
        return objTemp;
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
        this.setState({filter:value});
        this.update = true;
    }

    updateParam1 = (value) => {
        this.setState({param1: value});
        this.update = true;
        // Push url to browser history
        var urlVars = this.getParams(this.props.location);
        var urlValue = urlVars.typeArea+'/'+urlVars.param1+'/'+value+'/';
        this.props.history.push('?p='+urlValue);
        // Call parent frame with new url
        try{
            window.parent.postMessage('updateUrl',urlValue);
        }catch(err){}
    }

    updateParam2 = (value) => {
        this.setState({param2: value});
        this.update = true;
        // Push url to browser history
        var urlVars = this.getParams(this.props.location);
        var urlValue = urlVars.typeArea+'/'+urlVars.param1+'/'+value+'/';
        this.props.history.push('?p='+urlValue);
        // Call parent frame with new url
        try{
            window.parent.postMessage('updateUrl',urlValue);
        }catch(err){}
    }

    areaTypeSelect = (value) => {
        console.log('areaTypeSelect : ',value);
        this.setState({typeArea: value});
        this.update = true;
        // Set to browser history
        var urlVars = this.getParams(this.props.location);
        var urlValue = urlVars.typeArea+'/'+urlVars.param1+'/'+value+'/';
        this.props.history.push('?p='+urlValue);
        // Call parent frame with new url
        try{
            window.parent.postMessage('updateUrl',urlValue);
        }catch(err){}
    }

    getHumanFromID = (id) => {
        var output = null;
        try{
            output =  config_filters[0][id].human
        }catch(err){
            output = id;
            console.log("Error ::: looking for Human :::", output);
        }
        return output;
    }

    getDistincFromID = (id) => {
        var output = null;
        try{
            output =  config_filters[0][id].distincnum;
        }catch(err){
            output = id;
            console.log("Error ::: looking for Distincnum :::", output);
        }
        return output;
    }

    createSelectJson = (type,param) => {
        // Clone multidimentional array (which is tricky)
        if(type.indexOf('Simple')!==-1){
            // Simple JSON
            var selectObj = JSON.parse(JSON.stringify(catHierarchy_simple));
        }else{
            // Detailed JSON
            var selectObj = JSON.parse(JSON.stringify(catHierarchy.cat_hierarchy));
        }
        
        for(let i=0;i<selectObj.length;i++){
            // check if is selected
            if(selectObj[i].value === param ){
                //console.log('selected tag',selectObj[i].value , param);
                selectObj[i].isDefaultValue = true;
            }
            var totalItemsLevel1 = 0;
            try{
                totalItemsLevel1 =selectObj[i].children.length
            }catch(err){}
            for(let j=0;j<totalItemsLevel1;j++){
                //
                if(selectObj[i].children[j].label==='' || selectObj[i].children[j].label===undefined ){
                    let id =  selectObj[i].children[j].value;
                    //console.log('value: ',this.getHumanFromID(id));
                    if( id!==undefined && id!=="" ) selectObj[i].children[j].label = this.getHumanFromID(id);
                    if(this.getDistincFromID(id)>Config.MAX_DISTINC){
                        selectObj[i].children[j].remove = true;
                        selectObj[i].children[j].hide = true;
                    } 
                }
                if(selectObj[i].children[j].value === param ){
                    //console.log('selected tag',selectObj[i].children[j].value , param)
                    selectObj[i].children[j].isDefaultValue = true;
                    selectObj[i].expanded = true;
                }
                
                var totalItemsLevel2 = 0;
                try{
                    totalItemsLevel2 = selectObj[i].children[j].children.length
                }catch(err){}

                for(let h=0; h<totalItemsLevel2; h++){
                    if(selectObj[i].children[j].children[h].label==='' || selectObj[i].children[j].children[h].label===undefined){
                        let id =  selectObj[i].children[j].children[h].value;
                        selectObj[i].children[j].children[h].label = this.getHumanFromID(id);
                        if(this.getDistincFromID(id)> Config.MAX_DISTINC){
                            selectObj[i].children[j].children[h].remove = true;
                            selectObj[i].children[j].children[h].hide = true;
                        } 
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

    getParams = (location) => {
        const searchParams = new URLSearchParams(location.search);
        let p = searchParams.get("p") ;
        let ar;
        try{
            ar = p.split('/');
            return {
                typeArea:ar[0], param1: ar[1] , param2: ar[2] , filter: ar[3] 
            };
        }catch(err){
            return {
                typeArea:undefined, param1: undefined , param2: undefined , filter: undefined 
            };
        }
        
       
    }
   
    openPopupbox = (data) => {
        console.log("openPopupbox :",data);
        console.log("openPopupbox :",data['year']);

        const agreementID = data.AgtId;
        const agreementName = data.Agt;
        const id = data.id;
        const dateSigned = data.Dat;

        var excludeProp = ['Agt','Dat','id','foundFilter','AgtId','Year'];

        //var objClean = {'Mentioned in this Agreement':''};
        var objClean = {};
        // clean obj with properties zero
        for (const prop in data) {
            if(data[prop]!==0 && !_.includes(excludeProp,prop) ){ //&& data[prop]!==1
                objClean[this.getHumanFromID(prop)] = data[prop]
            }
            /*
            if(data[prop]===1){
                objClean['Mentioned in this Agreement'] += this.getHumanFromID(prop)+',';
            }
            */
        }

        /*
        if(objClean['Mentioned in this Agreement'] ==='' ){
            delete objClean['Mentioned in this Agreement'];
        }else{
            objClean['Mentioned in this Agreement'] = objClean['Mentioned in this Agreement'].substring(0, objClean['Mentioned in this Agreement'].length - 1);
        } 
        */

        const content = (
            <div>
                <div className="header_title"> 
                    <span className="buttonWithOutBorder"><span className="strongText">Agreement ID:</span> {agreementID}</span><br/> 
                    <span className="buttonWithOutBorder"><span className="strongText">Agreement Name:</span> {agreementName}</span><br/> 
                    <span className="buttonWithOutBorder"><span className="strongText">Date Signed:</span> {dateSigned}</span><br/>
                </div>
                <div className="header"> 
                <span> Get Agreement in:</span> <span >[<a href={'https://www.peaceagreements.org/viewmasterdocument/'+agreementID}  className="linkPDFDocument"  target="_blank" rel="noopener noreferrer">PDF</a>]</span>  <span>[ <a href={'https://www.peaceagreements.org/view/'+agreementID} className="linkPDFDocument" target="_blank" rel="noopener noreferrer">HTML</a> ]</span>  
                </div>
                <div>
                    {Object.keys(objClean).map((obj) => (
                        <p><span className="strongText">{obj}</span> : {objClean[obj]}</p>
                    ))}
                </div>
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
        const area_x = Config.AREAX;
        const area_y = Config.AREAY;

        // Select parameters between URL and changes
        var urlVars = this.getParams(this.props.location);
        console.log('new new params',urlVars)
        var param1 = (urlVars.param1!==undefined && !this.update)? urlVars.param1:this.state.param1;
        var param2 = (urlVars.param2!==undefined && !this.update)? urlVars.param2:this.state.param2;
        var filter = (urlVars.filter!==undefined && !this.update)? urlVars.filter:this.state.filter;
        var typeArea = (urlVars.typeArea!==undefined && !this.update)? urlVars.typeArea:this.state.typeArea;

        //var typeArea = this.state.typeArea;
        this.update = false;

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
            default:
                data = dataCFsim;
                break;
        }

        var selectObjParam1 = this.createSelectJson(typeArea,param1);
        console.log("selectObjParam1",param1,selectObjParam1);
        var selectObjParam2 = this.createSelectJson(typeArea,param2);
        console.log("selectObjParam2",param2,selectObjParam2);
        console.log("Current filter :",filter);

        var totalDataEntries = data.length;
        console.log('Total data length: ',totalDataEntries);

        // Sort by date (From older to new)
        data = _.sortBy(  data, 'Dat' );
        

        // Nesting param2 from data
        var groupedByParam2 = groupBy(data, param2);
        // Delete property with same name as param2
        try{ delete groupedByParam2[param2]; }catch(err){}
        console.log('non sorted groupedByParam2: ',groupedByParam2)
        groupedByParam2 = this.sortObjKeysAlphabetically(groupedByParam2);
        console.log('Sorted groupedByParam2: ',groupedByParam2)

        // Add id to Array
        var dataWithId = this.addIdPropertyToAr(data);
      
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
            for (const prop in groupedByParam2) {
                myObjectSorted[prop] = myObject[prop];
            } 
            
            var arSorted = this.ObjToAr(myObjectSorted);
            console.log('ArSorted: ',arSorted);
            var outAr = [];
            for(let j=0; j<arSorted.length; j++){
                var sortedAr = _.sortBy(  arSorted[j].value, 'Dat' );
                // Sort for find if has filter
                if(this.props.filter!=="" && sortedAr.length>0){
                    //console.log('filter:',this.props.filter);
                    console.log('sortedAr[0]: ',sortedAr)
                    
                    for(let k=0; k<sortedAr.length; k++){
                        sortedAr[k].foundFilter = false;
                        for (const prop in sortedAr[k]) {
                            let value = sortedAr[k][prop];
                        //Object.entries(sortedAr[k]).forEach(([key, value]) => {
                            //console.log(value, typeof value)
                            if(typeof value === 'string' && !(value==="0") && !(value==="1") && value.toLowerCase().indexOf(filter.toLowerCase())!==-1){ 
                                sortedAr[k].foundFilter = true;
                                totalFoundFilter +=1;
                            }
                        } 
                        //});
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
        var totalGroups = groupedByParam1SortedByName.length; 
        
        // Calculate Groups size
        var columnsGroups = Math.ceil(Math.sqrt(totalGroups));
        var fullRowsGroups = Math.floor(totalGroups / columnsGroups);
        var orphansGroups = totalGroups % columnsGroups;  
        var rowsGroups =  (orphansGroups === 0 ? fullRowsGroups : (fullRowsGroups+1));
        var widthGroups =  (area_x/ columnsGroups)-1; // -1px for margin
        var heightGroups = (area_y /rowsGroups); // reduce height if there are orphans
        var textTitleSpace = 20; // important!!
        // Calculate Blocks size
        var groupWidth = widthGroups; 
        var groupHeight = heightGroups;
        console.log('columnsGroups',columnsGroups,'rowsGroups',rowsGroups,'groupWidth',groupWidth,'area_x',area_x,'heightGroups',heightGroups,'area_x',area_y);

        // Calculate size block rect
        var maxBlocksInAGroup = groupedByParam1SortedBySize[0].value.length;

        var columnsBlocks = Math.ceil(Math.sqrt(maxBlocksInAGroup));
        var fullRowsBlocks = Math.floor(maxBlocksInAGroup / columnsBlocks);
        var orphansBlocks = maxBlocksInAGroup % columnsBlocks;  
        var rowsBlocks =  (orphansBlocks === 0 ? fullRowsBlocks : (fullRowsBlocks+1));

        var widthBlocks =  Math.floor(widthGroups/ columnsBlocks);
        var heightBlocks = Math.floor((heightGroups-textTitleSpace) /fullRowsBlocks); // reduce height if there are orphans
        
        console.log('columnsBlocks:',columnsBlocks,'rowsBlocks:  ',rowsBlocks,' :: ',maxBlocksInAGroup, '<=', rowsBlocks*columnsBlocks) 
        console.log("groupedByParam2",groupedByParam2);
        console.log("groupedBy:", groupedByParam1);
        console.log("groupedBySorted:", groupedByParam1SortedByName);

        const url = '/?p='+typeArea+'/'+param1+'/'+param2+'/'+filter
        
        console.log('redirect',url);
        console.log('groupedByParam1["undefined"] ',!(groupedByParam1['undefined']!==undefined),' groupedByParam2["undefined"]', !(groupedByParam2['undefined']!==undefined));
        return (
            <div>
                <Redirect to={url}/>
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
                        { !(groupedByParam1["undefined"]!==undefined) && !(groupedByParam2["undefined"]!==undefined)?
                        <Groups
                        items={groupedByParam1SortedBySize}
                        colorAr={groupedByParam2}
                        param1={param1}
                        param2={param2}
                        filter={filter}
                        groupWidth={groupWidth}
                        groupHeight={groupHeight}
                        blockWidth={widthBlocks}
                        blockHeight={heightBlocks}
                        columnsBlocks={columnsBlocks}
                        rowsBlocks={rowsBlocks}
                        openPopupbox={this.openPopupbox}
                        />
                        :null}
                    </div>
                </div>
                <PopupboxContainer />
            </div>
        );
    }

}