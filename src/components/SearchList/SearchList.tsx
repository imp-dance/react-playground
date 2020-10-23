import React, { useEffect, useState } from "react";
import "./SearchList.css";
import useSearch from "../../hooks/useSearch";
import DisplayData from "../DisplayData/DisplayData";
import usePagination from "../../hooks/usePagination";
import DisplayPagination from "../DisplayPagination/DisplayPagination";

const moreData = [
  { name: "Håkon" },
  { name: "Ole" },
  { name: "Per" },
  { name: "Pål" },
  { name: "Askeladden" },
  { name: "Bob" },
  { name: "John" },
];

function SearchList() {
  const [select, setSelect] = useState("5");
  const [list, setList] = useState([{}]);
  const [searchProps, filteredList] = useSearch(list);
  const [paginatedList, paginationProps] = usePagination(filteredList, {
    perPage: parseInt(select),
    isHidden: (item) => item.__match && item.__match.length !== 0,
  });

  useEffect(() => {
    fetch("https://pokeapi.co/api/v2/berry/")
      .then((res) => res.json())
      .then((data) => {
        setList([...data.results, ...moreData]);
      });
  }, []);

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
          <li key={index}>{item.name}</li>
        ))}
      </ul>
      <DisplayPagination
        {...paginationProps}
        containerClassname="paginationContainer"
      />
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
      <DisplayData data={filteredList} />
    </div>
  );
}

export default SearchList;
