import { calculateViewWindow, createElement } from "../../utils/funtions";
import "./CanvasContainer.css";

export default function CanvasContainer({
  canvas,
}: {
  canvas: HTMLElement;
}): HTMLElement {
  window.addEventListener("resize", () => {
    const newViewWindow = calculateViewWindow(window.innerWidth);
    const htmlCanvas = canvas as HTMLCanvasElement;
    htmlCanvas.width = newViewWindow.width;
    htmlCanvas.height = newViewWindow.height;
  });
  return createElement("div", { className: "canvas-container" }, canvas);
}
