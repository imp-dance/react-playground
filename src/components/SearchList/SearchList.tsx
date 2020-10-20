import React from "react";
import "./SearchList.css";
import list from "./list";
import useSearch from "../../hooks/useSearch";
import DisplayData from "../DisplayData/DisplayData";


function SearchList(){
    const [searchProps, filteredList] = useSearch(list);
    return (
        <div className="searchList">
            <input type="text" {...searchProps} />
            <ul>
                {filteredList.map((item, index) => {
                    if (item["__match"] && item.__match.length !== 0){
                        return (<li key={index}>{item.title}</li>)
                    }
                    return null;
                })}
            </ul>
            <DisplayData data={filteredList} />
        </div>
    )
}

export default SearchList;