import * as PIXI from "pixi.js-legacy";
import * as SKIA from "skia";

export class SpriteRenderer {
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
