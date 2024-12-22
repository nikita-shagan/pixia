import { createElement } from "../../utils/funtions";
import "./Controls.css";

export default function Controls({
  children,
}: {
  children: HTMLElement[];
}): HTMLElement {
  return createElement("div", { className: "controls" }, ...children);
}
