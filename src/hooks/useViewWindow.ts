import { calculateViewWindow } from "../utils/funtions";

export default function useViewWindow(): {
  width: number;
  height: number;
} {
  const viewWindow = calculateViewWindow(window.innerWidth);
  window.addEventListener("resize", () => {
    const newViewWindow = calculateViewWindow(window.innerWidth);
    viewWindow.height = newViewWindow.height;
    viewWindow.width = newViewWindow.width;
  });
  return viewWindow;
}
