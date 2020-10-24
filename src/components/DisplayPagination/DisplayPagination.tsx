import React from "react";
import "./DisplayPagination.css";

interface Props {
  pages: Array<number>;
  activePage: number;
  previousPage: () => void;
  nextPage: () => void;
  goToPage: (pageNum: number) => void;
  buttons: Array<number | string>;
  containerClassname?: string;
  nextPrevClassname?: string;
  activeClassname?: string;
  prevButton?: React.ReactNode;
  nextButton?: React.ReactNode;
  pageNumFunc?: (item: number) => React.ReactNode;
}

const DisplayPagination: React.FC<Props> = ({
  pages,
  activePage,
  previousPage,
  nextPage,
  goToPage,
  buttons,
  containerClassname = "",
  nextPrevClassname = "",
  activeClassname = "active",
  prevButton = <>&lsaquo;</>,
  nextButton = <>&rsaquo;</>,
  pageNumFunc = (item) => item,
}) => {
  if (pages?.length <= 1) return null;
  return (
    <div className={containerClassname}>
      <button onClick={() => previousPage()} className={nextPrevClassname}>
        {prevButton}
      </button>
      {buttons.map((pageNum, index) => {
        if (typeof pageNum === "string") {
          return (
            <span key={`ellipsis-${index}`} style={{ userSelect: "none" }}>
              &hellip;
            </span>
          );
        }
        const props = {
          onClick: () => goToPage(pageNum),
          className:
            activePage === pageNum
              ? `${activeClassname || "active"}`
              : undefined,
        };
        return (
          <button {...props} key={`pagination-button-${pageNum}`}>
            {pageNumFunc(pageNum)}
          </button>
        );
      })}
      <button onClick={() => nextPage()} className={nextPrevClassname}>
        {nextButton}
      </button>
    </div>
  );
};

export default DisplayPagination;
