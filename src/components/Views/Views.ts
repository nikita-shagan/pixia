import { createElement } from "../../utils/funtions";
import "./Views.css";

export default function Views({
  children,
}: {
  children: HTMLElement[];
}): HTMLElement {
  return createElement("div", { className: "views" }, ...children);
}
