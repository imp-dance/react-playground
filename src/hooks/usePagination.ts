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
  buttons: Array<number | string>;
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
    if (pageNum <= 1) {
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

  const calculateButtons = (): Array<number | string> => {
    const buttons: Array<number | string> = [1, pages.length];
    if (pages?.length <= 6) {
      return pages;
    }
    if (activePage < 3) {
      buttons.splice(-1, 0, 2);
      buttons.splice(-1, 0, 3);
      buttons.splice(-1, 0, 4);
      buttons.splice(-1, 0, "...");
      return buttons;
    }
    if (activePage === pages.length - 1) {
      buttons.splice(-1, 0, "...");
      buttons.splice(-1, 0, activePage - 2);
      buttons.splice(-1, 0, activePage - 1);
      buttons.splice(-1, 0, activePage);
      return buttons;
    }
    if (activePage === pages.length) {
      buttons.splice(-1, 0, "...");
      buttons.splice(-1, 0, activePage - 3);
      buttons.splice(-1, 0, activePage - 2);
      buttons.splice(-1, 0, activePage - 1);
      return buttons;
    }
    if (activePage >= 3) {
      if (activePage !== 3) {
        buttons.splice(1, 0, "...");
      }
      buttons.splice(-1, 0, activePage - 1);
      buttons.splice(-1, 0, activePage);
      buttons.splice(-1, 0, activePage + 1);
      if (activePage !== pages.length - 2) {
        buttons.splice(-1, 0, "...");
      }
      return buttons;
    }
    return buttons;
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
      buttons: calculateButtons(),
    },
  ];
}
