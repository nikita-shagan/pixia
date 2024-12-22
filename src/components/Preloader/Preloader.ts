import { createElement } from "../../utils/funtions";
import "./Preloader.css";

export default function Preloader() {
  return createElement(
    "div",
    { className: "preloader" },
    createElement(
      "div",
      { className: "preloader-bar" },
      createElement("div", { className: "preloader-bar-body" }),
    ),
  );
}
