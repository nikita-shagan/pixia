import * as PIXI from "pixi.js-legacy";
import * as SKIA from "skia";
import { createElement } from "../utils/funtions";
import { ContainerRenderer } from "../services/skia-wrapper";
import { CANVAS_VIEW_DEFAULT } from "../utils/constants";

export default async function useSkiaWrapper(
  pixiContainer: PIXI.Container,
  canvasKit: SKIA.CanvasKit,
  viewWindow: {
    width: number;
    height: number;
  },
): Promise<{ skiaRenderer: ContainerRenderer; skiaCanvas: HTMLCanvasElement }> {
  const skiaCanvas = createElement("canvas", {
    style: `background: ${CANVAS_VIEW_DEFAULT.background}`,
    width: `${viewWindow.width}px`,
    height: `${viewWindow.height}px`,
  }) as HTMLCanvasElement;
  const skiaRenderer = new ContainerRenderer(
    canvasKit,
    pixiContainer,
    skiaCanvas,
    CANVAS_VIEW_DEFAULT.background,
  );
  return { skiaRenderer, skiaCanvas };
}
