import React from "react";
import "./SearchList.css";
import list from "./list";
import useSearch from "../../hooks/useSearch";
import DisplayData from "../DisplayData/DisplayData";
import usePagination from "../../hooks/usePagination";
import DisplayPagination from "../DisplayPagination/DisplayPagination";

function SearchList() {
  const [searchProps, filteredList] = useSearch(list);
  const [paginatedList, paginationProps] = usePagination(filteredList, {
    perPage: 2,
    isHidden: (item) => item.__match && item.__match.length !== 0,
  });

  return (
    <div className="searchList">
      <input type="text" {...searchProps} />
      <ul>
        {paginatedList.map((item, index) => (
          <li key={index}>{item.title}</li>
        ))}
      </ul>
      <DisplayPagination {...paginationProps} />
      <DisplayData data={filteredList} />
    </div>
  );
}

export default SearchList;
