import { useEffect, useState } from "react";

function useSearch(
  list: Array<any>,
  options?: IOptions
): [ISearchProps, Array<any>] {
  const [search, setSearch] = useState("");
  const [filteredList, setFilteredList] = useState<Array<any>>([{}]);

  let searchableKeys: undefined | Array<string>,
    searchFunc: undefined | TSearchFunc;
  if (options) {
    if (options.searchableKeys) searchableKeys = options.searchableKeys;
    if (options.searchFunc) searchFunc = options.searchFunc;
  }

  useEffect(() => {
    // whenever user changes search
    setFilteredList(
      searchListOfObjects(list, search, searchableKeys, searchFunc)
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search, list, searchableKeys, searchFunc]);

  const searchProps = {
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = e.currentTarget.value;
      if (value) {
        setSearch(value);
      } else {
        setSearch("");
      }
    },
    value: search,
  };

  return [searchProps, filteredList];
}

function formatSearch(text: string) {
  return `${text
    .trim()
    .toLowerCase()
    .replace("+", "")
    .replace("*", "")
    .replace("(", "")
    .replace(")", "")
    .replace("[", "")
    .replace("]", "")
    .toString()}`;
}

function searchString(
  sentence: string,
  search: string,
  searchFunc?: TSearchFunc
) {
  if (searchFunc) return searchFunc(sentence, search);
  search = formatSearch(search);
  sentence = formatSearch(sentence);
  let matches = 0;
  const searchWords = search.split(" ");
  searchWords.forEach((searchWord) => {
    // for every word in searchbox
    const match = sentence.search(searchWord.toString()) !== -1;
    if (
      search === "" || // Have not started searching, all should match
      (searchWords.length === 1 && match) || // Only searched one word, allow 1-letter words
      (searchWords.length > 1 && match && searchWord.length > 1) // Searched more than one word, should not match 1-letter words
    )
      matches++;
  });

  return matches > 0;
}

function searchListOfObjects(
  list: Array<any>,
  search: string,
  searchableKeys?: Array<string> | undefined,
  searchFunc?: TSearchFunc
) {
  const newList: any = [];
  list.forEach((listItem) => {
    if (isNumber(listItem) || isString(listItem) || isArray(listItem)) {
      return;
    }
    // is object
    newList.push(searchObject(listItem, search, searchableKeys, searchFunc));
  });
  return newList;
}

function searchObject(
  object: any,
  search: string,
  searchableKeys?: Array<string> | undefined,
  searchFunc?: TSearchFunc
) {
  const newObject: any = {
    __match: [],
  };
  const arrayOfKeys = Object.keys(object);
  arrayOfKeys.forEach((key: any) => {
    const entry: any = object[key];
    if (searchableKeys && !searchableKeys.includes(key)) {
      newObject[key] = entry;
      if (isObject(entry)) {
        const newNestedObject = searchObject(
          entry,
          search,
          searchableKeys,
          searchFunc
        );
        if (newNestedObject.__match.length > 0) {
          newObject["__match"].push(key);
        }
      }
      return;
    }
    switch (true) {
      case isNumber(entry): {
        const stringEntry = entry.toString();
        if (searchString(stringEntry, search, searchFunc)) {
          newObject["__match"].push(key);
        }
        newObject[key] = entry;
        break;
      }
      case isString(entry): {
        if (searchString(entry, search, searchFunc)) {
          newObject["__match"].push(key);
        }
        newObject[key] = entry;
        break;
      }
      case isArray(entry): {
        const searchMatches = searchArray(
          entry,
          search,
          searchFunc,
          searchableKeys
        );
        if (searchMatches > 0) {
          newObject["__match"].push(key);
        }
        newObject[key] = entry;
        break;
      }
      case isObject(entry): {
        const newNestedObject = searchObject(
          entry,
          search,
          searchableKeys,
          searchFunc
        );
        if (newNestedObject.__match.length > 0) {
          newObject["__match"].push(key);
        }
        newObject[key] = newNestedObject;
      }
    }
  });
  return newObject;
}

function searchArray(
  array: Array<any>,
  search: string,
  searchFunc?: TSearchFunc,
  searchableKeys?: Array<string>
) {
  search = formatSearch(search);
  let matches = 0;
  array.forEach((searchTerm: any) => {
    switch (true) {
      case isString(searchTerm): {
        if (searchFunc && searchFunc(searchTerm, search)) {
          matches++;
        } else if (searchString(searchTerm, search)) {
          matches++;
        }
        break;
      }
      case isArray(searchTerm) &&
        searchArray(searchTerm, search, searchFunc, searchableKeys): {
        matches++;
        break;
      }
      case isNumber(searchTerm): {
        const stringifiedNumber = searchTerm.toString();
        if (searchString(stringifiedNumber, search, searchFunc)) {
          matches++;
        }
        break;
      }
      case isObject(searchTerm):
      default: {
        const newObject = searchObject(
          searchTerm,
          search,
          searchableKeys,
          searchFunc
        );
        if (newObject.__match.length > 0) {
          matches++;
        }
      }
    }
  });
  return matches;
}

function isArray(possiblyArray: any) {
  return Array.isArray(possiblyArray);
}

function isString(possiblyString: any) {
  return typeof possiblyString === "string";
}

function isNumber(value: any): boolean {
  const returnValue = typeof value === "number" && isFinite(value);
  return returnValue || isNumberObject(value);
}

function isNumberObject(value: any): boolean {
  return Object.prototype.toString.apply(value) === "[object Number]";
}

function isObject(value: any): boolean {
  return !isString(value) && !isArray(value) && !isNumber(value);
}

interface ISearchProps {
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  value: string;
}

type TSearchFunc = (sentence: string, search: string) => boolean;

interface IOptions {
  searchableKeys?: Array<string>;
  searchFunc?: TSearchFunc;
}

export default useSearch;
