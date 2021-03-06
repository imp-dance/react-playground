import React from "react";

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
  renderPageNum?: (item: number) => React.ReactNode;
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
  pageNumFunc,
  renderPageNum,
}) => {
  if (pages?.length <= 1) return null;
  let renderFunc: (item: number) => React.ReactNode = (item) => item;
  if (renderPageNum) {
    renderFunc = renderPageNum;
  } else if (pageNumFunc) {
    renderFunc = pageNumFunc;
  }
  return (
    <div className={containerClassname}>
      <button onClick={() => previousPage()} className={nextPrevClassname}>
        {prevButton}
      </button>
      {buttons.map((pageNum: number | string, index: number) => {
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
            {renderFunc(pageNum)}
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
