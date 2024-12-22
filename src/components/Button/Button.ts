import { createElement } from "../../utils/funtions";
import "./Button.css";

export default function Button(props: {
  onClick: (e: Event) => void;
  text: string;
}) {
  return createElement(
    "button",
    { className: "button", onClick: props.onClick },
    props.text,
  );
}
