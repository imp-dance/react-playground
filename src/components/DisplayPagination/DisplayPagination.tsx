import React from "react";

interface Props {
  pages: Array<number>;
  activePage: number;
  previousPage: () => void;
  nextPage: () => void;
  goToPage: (pageNum: number) => void;
  containerClassname?: string;
  nextPrevClassname?: string;
  activeClassname?: string;
}

const DisplayPagination: React.FC<Props> = ({
  pages,
  activePage,
  previousPage,
  nextPage,
  goToPage,
  containerClassname = "",
  nextPrevClassname = "",
  activeClassname = "active",
}) => {
  if (pages?.length <= 1) return null;
  return (
    <div className={containerClassname}>
      <button onClick={() => previousPage()} className={nextPrevClassname}>
        &lt;
      </button>
      {pages?.length >= 6 ? (
        <React.Fragment>
          {activePage >= 3 && (
            <React.Fragment>
              <button
                onClick={() => goToPage(1)}
                className={1 === activePage ? activeClassname : ""}
              >
                1
              </button>
              <span>...</span>
            </React.Fragment>
          )}
          {pages?.map?.((pageNum) => {
            // Three buttons, the one before, active, and after
            const isPartOfFirstThree =
              activePage === 1 && pageNum === activePage + 2;
            const isPartOfLastThree =
              activePage === pages.length && pageNum === pages.length - 2;
            if (
              pageNum !== activePage &&
              pageNum !== activePage - 1 &&
              pageNum !== activePage + 1 &&
              !isPartOfFirstThree &&
              !isPartOfLastThree // if all of these are false, ignore button (return)
            )
              return;
            return (
              // else return button
              <button
                onClick={() => goToPage(pageNum)}
                key={"pagination-button-" + pageNum}
                className={pageNum === activePage ? activeClassname : ""}
              >
                {pageNum}
              </button>
            );
          })}
          {activePage <= pages.length - 2 && (
            <React.Fragment>
              <span>...</span>
              <button
                onClick={() => goToPage(pages.length)}
                className={pages.length === activePage ? activeClassname : ""}
              >
                {pages.length}
              </button>
            </React.Fragment>
          )}
        </React.Fragment>
      ) : (
        pages?.map?.((pageNum) => (
          <button
            onClick={() => goToPage(pageNum)}
            key={"pagination-button-" + pageNum}
            className={pageNum === activePage ? activeClassname : ""}
          >
            {pageNum}
          </button>
        ))
      )}
      <button onClick={() => nextPage()} className={nextPrevClassname}>
        &gt;
      </button>
    </div>
  );
};

export default DisplayPagination;
