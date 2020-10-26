import { useEffect, useState } from "react";

interface IOptions {
  perPage?: number;
  onPageChange?: () => void;
  isHidden?: (item: any) => void;
  maxButtons?: number;
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
  const { perPage, onPageChange, isHidden, maxButtons } = options;

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
      onPageChange && onPageChange();
      return;
    }
    if (pageNum > pages.length) {
      setActivePage(pages.length);
      onPageChange && onPageChange();
      return;
    }
    setActivePage(pageNum);
    onPageChange && onPageChange();
  };

  const calculateButtons = (): Array<number | string> => {
    const buttons: Array<number | string> = [1, pages.length];
    const mB = maxButtons && maxButtons >= 5 ? maxButtons : 5; // minimum and default 5
    const amountOfButtons = mB - 2; // minus 1, pages.length
    if (pages?.length <= 6) {
      return pages;
    }
    if (activePage < amountOfButtons) {
      for (let i = 0; i < amountOfButtons; i++) {
        buttons.splice(-1, 0, i + 2);
      }
      buttons.splice(-1, 0, "...");
      return buttons;
    }
    if (activePage >= pages.length - (amountOfButtons - 1)) {
      buttons.splice(-1, 0, "...");
      for (let i = amountOfButtons; i > 0; i--) {
        buttons.splice(-1, 0, pages.length - i);
      }
      return buttons;
    }
    if (activePage >= 3) {
      if (activePage > 3) {
        buttons.splice(-1, 0, "...");
      }
      let newAmountOfButtons = amountOfButtons;
      const isOdd = amountOfButtons & 1;
      if (isOdd) {
        newAmountOfButtons = amountOfButtons - 1; // Turn even so we can put half and half on each side of activePage
      }
      if (newAmountOfButtons + 3 > mB) {
        newAmountOfButtons = newAmountOfButtons - 2; // amount of pages would be too high, so we'd rather have one less on each side
      }
      const halfOfButtons = newAmountOfButtons / 2;
      for (let i = halfOfButtons; i > 0; i--) {
        buttons.splice(-1, 0, activePage - i); // buttons before activePage
      }
      buttons.splice(-1, 0, activePage); // activePage
      for (let i = 1; i <= halfOfButtons; i++) {
        buttons.splice(-1, 0, activePage + i); // buttons after activePage
      }
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
