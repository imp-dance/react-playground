import { useEffect, useState } from "react";

interface IOptions {
  perPage?: number;
  onPageChange?: () => void;
  isHidden?: (item: any) => void;
}

interface IReturn {
  pages: Array<number>;
  activePage: number;
  previousPage: () => void;
  nextPage: () => void;
  goToPage: (pageNum: number) => void;
}

export default function usePagination(
  list: Array<any> = [{}],
  options: IOptions = { perPage: 10, onPageChange: () => {} }
): [Array<any>, IReturn] {
  const [activePage, setActivePage] = useState(1);
  const [pages, setPages] = useState([1]);
  const [filteredList, setFilteredList] = useState([{}]);
  const { perPage, onPageChange, isHidden } = options;

  const nextPage = () => {
    if (activePage !== pages.length) {
      setActivePage(activePage + 1);
    }
    onPageChange && onPageChange();
  };

  const previousPage = () => {
    if (activePage !== 1) {
      setActivePage(activePage - 1);
    }
    onPageChange && onPageChange();
  };

  const goToPage = (pageNum: number) => {
    if (pageNum < 1) {
      setActivePage(1);
      return;
    }
    if (pageNum > pages.length) {
      setActivePage(pages.length);
      return;
    }
    setActivePage(pageNum);
    onPageChange && onPageChange();
  };

  useEffect(() => {
    const pp = perPage ?? 10;
    const defaultHiddenFunc = (item: any) => true;
    const listFunc = isHidden ?? defaultHiddenFunc;
    const parsedList = list.filter(listFunc);
    setFilteredList(parsedList.slice(activePage * pp - pp, activePage * pp));

    const calculatePages = () => {
      const pp = perPage ?? 10;
      const amountOfPages: number = Math.ceil(parsedList.length / pp);
      const arrayOfPageNums: Array<number> = [];
      for (let i = 0; i < amountOfPages; i++) {
        arrayOfPageNums.push(i + 1);
      }
      setPages(arrayOfPageNums);
    };
    calculatePages();
    //eslint-disable-next-line react-hooks/exhaustive-deps
  }, [list, activePage, perPage]);

  return [
    filteredList,
    {
      activePage,
      pages,
      nextPage,
      previousPage,
      goToPage,
    },
  ];
}
