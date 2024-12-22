import * as PIXI from "pixi.js-legacy";
import * as SKIA from "skia";

/**
 * Class for rendering PIXI.Sprite on SKIA.Canvas.
 */
export class SpriteRenderer {
  /**
   * Renders PIXI.Sprite to Skia.Canvas
   * @param canvasKit skia wasm canvas kit
   * @param canvas SKIA.Canvas object on which to draw
   * @param sprite PIXI.Sprite to draw
   */
  static render(
    canvasKit: SKIA.CanvasKit,
    canvas: SKIA.Canvas,
    sprite: PIXI.Sprite,
  ): void {
    const paint = new canvasKit.Paint();
    const resource = sprite.texture.baseTexture.resource as PIXI.ImageResource;
    const source = resource.source as
      | HTMLImageElement
      | HTMLVideoElement
      | ImageBitmap
      | HTMLCanvasElement;
    const img = canvasKit.MakeImageFromCanvasImageSource(source);
    if (img) {
      canvas.drawImage(img, sprite.position.x, sprite.position.y, paint);
      img.delete();
    }
  }
}
