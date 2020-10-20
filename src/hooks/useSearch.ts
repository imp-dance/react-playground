import { useEffect, useState } from "react";

function useSearch(list: Array<any>, options?: IOptions): [ISearchProps, Array<any>]{
    const [search, setSearch] = useState("");
    const [filteredList, setFilteredList] = useState<Array<any>>([{}]);

    let searchableKeys: undefined | Array<string>, searchFunc: undefined | TSearchFunc;
    if (options){
      if (options.searchableKeys) searchableKeys = options.searchableKeys;
      if (options.searchFunc) searchFunc = options.searchFunc;
    }

    const doSearch = () => {
        const newList: any = [];
        list.forEach((listItem, index) => {
            const newListItem: any = {
                __match: []
            };
            if (isNumber(listItem)){
                return;
            }
            if (isString(listItem)){
                return;
            }
            if (isArray(listItem)){
                return;
            }
            const arrayOfKeys = Object.keys(listItem);
            arrayOfKeys.forEach((key: any) => {
                const entry: any = list[index][key];
                if (searchableKeys && !searchableKeys.includes(key)){
                    newListItem[key] = entry;
                    return;
                }
                // For each of the keys
                if (isNumber(entry)){
                    const stringEntry = entry.toString();
                    if (searchString(stringEntry, search, searchFunc)){
                        newListItem["__match"].push(key);
                    }
                    newListItem[key] = entry;
                }
                if (isString(entry)){
                    // Key value is string (searchable)
                    if (searchString(entry, search, searchFunc)){
                        newListItem["__match"].push(key);
                    }
                    newListItem[key] = entry;
                }
                if (isArray(entry)){
                    // Key value is array (searchable)
                    const searchMatches = searchArray(entry, search, searchFunc)
                    if (searchMatches > 0){
                        newListItem["__match"].push(key);
                    }
                    newListItem[key] = entry;
                }
                return; 
            });
            newList.push(newListItem);
        });
        setFilteredList(newList);
    }



    useEffect(() => {
        // whenever user changes search
        doSearch();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [search, list]) 

    const searchProps = {
        onChange: (e: React.ChangeEvent<HTMLInputElement>) => {
            const value = e.currentTarget.value;
            if (value){
                setSearch(value)
            }else{
                setSearch("")
            }
        },
        value: search
    }

    return [searchProps, filteredList]
}

function formatSearch(text: string){
    return text.trim().toLowerCase();
}

function searchString(sentence: string, search: string, searchFunc?: TSearchFunc){
    if (searchFunc) return searchFunc(sentence, search)
    search = formatSearch(search);
    sentence = formatSearch(sentence);
    let matches = 0;
    search.split(" ").forEach(searchWord => { // for every word in searchbox
      const match = sentence.search(searchWord) !== -1;
      if (match) matches++;
    });
  
    return matches > 0;
}

function searchArray(array: Array<any>, search: string, searchFunc?: TSearchFunc){
    search = formatSearch(search);
    let matches = 0;
    array.forEach((searchTerm: any) => {
        if (typeof searchTerm === "string"){
          if (searchFunc && searchFunc(searchTerm, search)){
            matches++;
          }else if (searchString(searchTerm, search)){
            matches++;
          }
        }
    })
    return matches;
}

function isArray(possiblyArray: any){
    return Array.isArray(possiblyArray);
}

function isString(possiblyString: any){
    return typeof possiblyString === "string";
}

function isNumber(value: any): boolean {
    const returnValue = typeof value === 'number' && isFinite(value)
    return returnValue || isNumberObject(value);;
 }
 
function isNumberObject(value: any): boolean {
    return (Object.prototype.toString.apply(value) === '[object Number]');
}

interface ISearchProps {
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    value: string;
}

type TSearchFunc = (sentence: string, search: string) => boolean;;

interface IOptions {
    searchableKeys?: Array<string>;
    searchFunc?: TSearchFunc;
}

export default useSearch;