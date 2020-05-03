// Libraries
import React from "react";
import { groupBy} from "lodash";
import _ from 'lodash';

// Area components
import Groups from "./Groups";
import FilterList from "./FilterList";
import FilterForm from "./FilterForm";
import { OutputFileType } from "typescript";

export default class Area extends React.Component {
    constructor() {
        super();
        this.state = {
            param1 : "Reg",
            param2 : "Reg",
            filter : "human",
        }
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

    render() {
        // Config variables
        var max_distinc = 50;
        var area_x = 1100;
        var area_y = 900;
        var colors_approach = "fix"; // fix, random, gradient
        var area_title = "PeaceAgreements.org";
        
        var param1 = this.state.param1;
        var param2 = this.state.param2;
        var filter = this.state.filter;
        console.log("current filter :",filter);

        var totalDataEntries = this.props.data.length;

        console.log('total data length: ',totalDataEntries);
        // Add id to Array
        var dataWithId = this.addIdPropertyToAr(this.props.data);

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
        try{delete groupedByParam2[param2];}catch(err){}
        console.log("groupedBy:", groupedByParam1);
        console.log("groupedBySorted:", groupedByParam1SortedByName);

        return (
            <div>
                <FilterForm />
                <FilterList items={groupedByParam1} keyStr={"Param1"} />
                <FilterList items={groupedByParam2} keyStr={"Param2"} />
                <Groups
                items={groupedByParam1SortedByName}
                colourData={groupedByParam2}
                param1={param1}
                param2={param2}
                groupWidth={groupWidth}
                groupHeight={groupHeight}
                blockWidth={blockWidth}
                blockHeight={blockHeight}
                dim_block={dim_block}
                />
            </div>
        );
    }

}