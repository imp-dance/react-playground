import React, { useState } from "react";

const getTotalOffset = (el: HTMLElement) => {
  let a: any = el,
    x = 0,
    y = 0;
  while (a) {
    x += a.offsetLeft;
    y += a.offsetTop;
    a = a.offsetParent;
  }
  return { offsetX: x, offsetY: y };
};

function useMouseMove(
  reference: React.RefObject<HTMLElement>
): [(e: React.MouseEvent) => void, React.CSSProperties] {
  const [mousePointer, setMousePointer] = useState({ x: 0, y: 0 });
  const mouseMove = (event: React.MouseEvent) => {
    if (reference?.current) {
      const { pageX, pageY } = event;
      const { offsetX, offsetY } = getTotalOffset(reference.current);
      const x = pageX - offsetX;
      const y = pageY - offsetY;
      setMousePointer({
        x,
        y,
      });
    }
  };
  const styles = {
    "--x": mousePointer.x,
    "--y": mousePointer.y,
  } as React.CSSProperties;
  return [mouseMove, styles];
}

export default useMouseMove;
