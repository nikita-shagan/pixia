import { PixiObjectsGenerator } from "../services/pixi-random";
import imageOne from "../assets/1.png";
import imageTwo from "../assets/2.png";
import imageThree from "../assets/3.png";

export default function useRandomObjectsGenerator(viewWindow: {
  width: number;
  height: number;
}) {
  return new PixiObjectsGenerator([imageOne, imageTwo, imageThree], viewWindow);
}
