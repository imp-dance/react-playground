import React, { useEffect, useState } from "react";
import "./SearchList.css";
import "../DisplayPagination/DisplayPagination.css";
import useSearch from "../../hooks/useSearch";
import DisplayData from "../DisplayData/DisplayData";
import usePagination, { DisplayPagination } from "@impedans/usepagination";

function SearchList() {
  const [maxButtons, setMaxButtons] = useState("5");
  const [select, setSelect] = useState("5");
  const [list, setList] = useState([{}]);
  const [searchProps, filteredList] = useSearch(list);
  const [paginatedList, paginationProps] = usePagination(filteredList, {
    perPage: parseInt(select),
    isHidden: (item) => item.__match && item.__match.length !== 0,
    maxButtons: parseInt(maxButtons),
  });

  useEffect(() => {
    fetch("https://jsonplaceholder.typicode.com/todos/")
      .then((res) => res.json())
      .then((data) => setList(data))
      .catch((err) => console.error(err));
  }, []);

  const restListAmount = parseInt(select) - paginatedList.length;
  const restList = [];
  for (let i = 0; i < restListAmount; i++) {
    restList.push(
      <li key={`seperator-${i}`} style={{ userSelect: "none" }}>
        &nbsp;
      </li>
    );
  }

  return (
    <div className="searchList">
      <h3>Search</h3>
      <input
        type="text"
        placeholder="Please type search query"
        value={searchProps.value}
        onChange={(e) => {
          searchProps.onChange(e);
          paginationProps.goToPage(1);
        }}
      />
      <ul>
        {paginatedList.map((item, index) => (
          <li key={`index-${item.id}-${index}`}>{item.title}</li>
        ))}
        {restList}
      </ul>
      <DisplayPagination
        {...paginationProps}
        containerClassname="paginationContainer"
        renderPageNum={(pageNum) => `#${pageNum}`}
        nextButton={"Next"}
        prevButton={"Previous"}
        nextPrevClassname="nextPrev"
      />
      <br />
      <strong>perPage</strong>
      <select
        value={select}
        onChange={(e) => {
          setSelect(e.currentTarget.value);
          paginationProps.goToPage(1);
        }}
      >
        <option>3</option>
        <option>5</option>
        <option>7</option>
        <option>10</option>
      </select>
      <br />
      <strong>maxButtons</strong>
      <select
        value={maxButtons}
        onChange={(e) => {
          setMaxButtons(e.currentTarget.value);
        }}
      >
        <option>5</option>
        <option>6</option>
        <option>7</option>
        <option>8</option>
        <option>9</option>
      </select>
      <DisplayData
        data={filteredList.filter(
          (item) => item.__match && item.__match.length > 0
        )}
      />
    </div>
  );
}

export default SearchList;
