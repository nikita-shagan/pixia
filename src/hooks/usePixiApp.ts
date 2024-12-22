import * as PIXI from "pixi.js-legacy";
import { CANVAS_VIEW_DEFAULT } from "../utils/constants";

export default function usePixiApp(viewWindow: {
  width: number;
  height: number;
}) {
  const pixiApp = new PIXI.Application<HTMLCanvasElement>({
    resolution: 1,
    forceCanvas: true,
    background: CANVAS_VIEW_DEFAULT.background,
    ...viewWindow,
  });

  const pixiTopContainer = new PIXI.Container();
  pixiApp.stage.addChild(pixiTopContainer);

  return { pixiApp, pixiTopContainer };
}
