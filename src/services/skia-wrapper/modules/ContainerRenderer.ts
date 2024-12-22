import * as PIXI from "pixi.js-legacy";
import * as SKIA from "skia";
import { ColorConverter } from "./ColorConverter";
import { GraphicsRenderer } from "./GraphicsRenderer";
import { SpriteRenderer } from "./SpriteRenderer";
import { HitRegionsManager } from "./HitRegionsManager";
import { ListenersManager } from "./ListenersManager";

/**
 * Class for rendering PIXI.Container on SKIA.Canvas, or on PDF canvas
 * @param canvasKit – skia wasm canvas kit
 * @param pixiContainer – PIXI.Container to render
 * @param htmlCanvas – html canvas for skia on which to render
 * @param backgroundColor – fill color of canvas
 */
export class ContainerRenderer {
  private readonly _canvasKit: SKIA.CanvasKit;
  private readonly _pixiContainer: PIXI.Container;
  private readonly _htmlCanvas: HTMLCanvasElement;
  private readonly _backgroundColor: SKIA.Color;
  private readonly _surface: SKIA.Surface;
  private readonly _canvas: SKIA.Canvas;
  private readonly _hitRegionsManager: HitRegionsManager;
  private readonly _eventTypes: (keyof PIXI.FederatedEventMap)[] = [
    "pointerdown",
    "pointerup",
  ];

  constructor(
    canvasKit: SKIA.CanvasKit,
    pixiContainer: PIXI.Container,
    htmlCanvas: HTMLCanvasElement,
    backgroundColor: string,
  ) {
    const surface = canvasKit.MakeSWCanvasSurface(htmlCanvas);
    const canvas = surface?.getCanvas() ?? null;
    if (!canvas || !surface) {
      throw new Error("Can't create canvas");
    }
    this._canvasKit = canvasKit;
    this._pixiContainer = pixiContainer;
    this._htmlCanvas = htmlCanvas;
    this._surface = surface;
    this._canvas = canvas;
    this._backgroundColor = ColorConverter.convertColor(
      this._canvasKit,
      backgroundColor,
    );
    this._hitRegionsManager = new HitRegionsManager(this._eventTypes);
    ListenersManager.applyListeners(
      htmlCanvas,
      this._eventTypes,
      () => this._hitRegionsManager.hitRegions,
      this.renderOnScreen.bind(this),
    );
  }

  /**
   * Renders PIXI.Container on screen
   */
  renderOnScreen(): void {
    setTimeout(() => {
      this._hitRegionsManager.mapObjectsToRegions(this._pixiContainer);
      this._canvas.clear(this._backgroundColor);
      this._renderContainer();
      this._surface.flush();
    }, 10);
  }

  /**
   * Renders PIXI.Container on inner wasm skia canvas and creates pdf document
   * @return pdf bytes of created pdf document
   */
  renderOnPDF(): BlobPart | void {
    const surface = this._canvasKit.MakeSWCanvasSurface(this._htmlCanvas);
    const canvas = surface?.getCanvas() ?? null;
    if (canvas) {
      canvas.clear(this._backgroundColor);
      this._renderContainer();
      return canvas.makePDF();
    }
  }

  private _renderContainer() {
    this._pixiContainer.children.forEach((child) => {
      this._canvas?.save();
      this._applyTransformations(child, this._canvas);
      if (child instanceof PIXI.Graphics) {
        GraphicsRenderer.render(this._canvasKit, this._canvas, child);
      } else if (child instanceof PIXI.Sprite) {
        SpriteRenderer.render(this._canvasKit, this._canvas, child);
      } else if (child instanceof PIXI.Container) {
        this._renderContainer();
      }
      this._canvas?.restore();
    });
  }

  private _applyTransformations(
    displayObject: PIXI.DisplayObject,
    canvas: SKIA.Canvas,
  ): void {
    canvas.translate(displayObject.position.x, displayObject.position.y);
    canvas.rotate(displayObject.angle, 0, 0);
    canvas.scale(displayObject.scale.x, displayObject.scale.y);
  }
}
