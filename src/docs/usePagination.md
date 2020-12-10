# @impedans/usepagination

This package comes with a hook and a display-component that's built to recieve the hook data. You can easily render your own pagination buttons using just the data from the hook, but the display component makes your life a little bit easier still.

## Code
* [usePagination.ts](https://github.com/imp-dance/react-playground/blob/master/src/hooks/usePagination.ts)
* [DisplayPagination.tsx](https://github.com/imp-dance/react-playground/blob/master/src/components/DisplayPagination/DisplayPagination.tsx)

## Example

```jsx
import React, { useEffect, useState } from "react";
import usePagination, { DisplayPagination } from "@impedans/usepagination";

function App(){
    const [data, setData] = useState();
    const [paginatedList, paginationProps] = usePagination(data, {
        perPage: 6,
        maxButtons: 7
    });

    useEffect(() => {
        let unMounted = false;
        fetch("https://jsonplaceholder.typicode.com/todos/")
            .then(res => res.json())
            .then(res => {
               if (!unMounted) setData(res);
            })
            .catch(err => console.error(err));
        return () => {
            unMounted = true;
        }
    }, []);

    return (
        <main>
            <button onClick={() => paginationProps.goToPage(1)}>Go to page 1</button>
            <ul>
                {paginatedList.map(item => <li>{item.name}</li>}
            </ul>
            <DisplayPagination {...paginationProps} pageNumFunc={(pageNum) => `Page #${pageNum}`} />
        </main>
    );
}


```

## API: usePagination

### Props

| Prop-name | Description                     | Type          |
| --------- | ------------------------------- | ------------- |
| list      | Your list to be paginated       | Array<any>    |
| options   | An object with optional options | OptionsObject |

**OptionsObject** (all keys are optional)

| Key              | Description                                                                                | Type                |
| ---------------- | ------------------------------------------------------------------------------------------ | ------------------- |
| **perPage**      | How many entries per page (_default: 10_)                                                  | number              |
| **onPageChange** | Function that runs on every page change                                                    | () => void          |
| **isHidden**     | Function that filters hidden items from list (read more below)                             | (item: any) => void |
| **maxButtons**   | How many buttons maximum in the pagination (except next & previous buttons) (_default: 5_) | number              |

The `isHidden` function is used when your list hides items not by removing them but by for example adding a `hidden: true` property. In that case, you can supply a function like this: `(item) => !item.hidden`.

### Output / return

The hook returns an array containing two items:

| Name       | Description                                     | Type             |
| ---------- | ----------------------------------------------- | ---------------- |
| list       | Your paginated list                             | Array<any>       |
| pagination | An object functions and data for the pagination | PaginationObject |

**PaginationObject**

| Key              | Description                                                | Type                       |
| ---------------- | ---------------------------------------------------------- | -------------------------- |
| **pages**        | An array with all the page-numbers                         | Array<number>              |
| **activePage**   | The currently active page                                  | number                     |
| **buttons**      | An array with all the buttons for rendering the pagination | Array<number / string>     |
| **previousPage** | Function that goes to the previous page                    | () => void)                |
| **nextPage**     | Function that goes to the next page                        | () => void)                |
| **goToPage**     | Function that goes to a specific page-number               | (pageNum: number) => void) |

## API: DisplayPagination

DisplayPagination takes a lot of props. First of all, it takes the entire **PaginationObject** as defined above, but it also takes a few more optional props:

| Key                                  | Description                                                               | Type                              |
| ------------------------------------ | ------------------------------------------------------------------------- | --------------------------------- |
| **containerClassname**               | Classname for the container                                               | string                            |
| **nextPrevClassname**                | Classname for the next & previous page buttons                            | string                            |
| **activeClassname**                  | Classname for the button for the active pagenumber                        | string                            |
| **prevButton**                       | The contents of the previous page button                                  | React.ReactNode                   |
| **nextButton**                       | The contents of the next page button                                      | React.ReactNode                   |
| **pageNumFunc** or **renderPageNum** | A function that runs to render each of the page numbers (read more below) | (item: number) => React.ReactNode |

`renderPageNum` (alias `pageNumFunc`) runs on the inside content of the page-number buttons. This is if you want to change how they are rendered, for example if instead of showing just the page number (_1, 2, 3, etc_) you wanted to show "Page x" (_Page 1, Page 2, Page 3, etc_), then you could supply this function: `(item) => 'Page ' + item`
