import * as PIXI from "pixi.js-legacy";
import * as SKIA from "skia";

export default class SkiaWrapper {
  private readonly _canvasKit: SKIA.CanvasKit;
  private readonly _pixiContainer: PIXI.Container;
  private readonly _htmlCanvas: string | HTMLCanvasElement;
  private readonly _surface: SKIA.Surface | null;
  private readonly _canvas: SKIA.Canvas | null;

  constructor(
    canvasKit: SKIA.CanvasKit,
    pixiContainer: PIXI.Container,
    htmlCanvas: string | HTMLCanvasElement,
  ) {
    this._canvasKit = canvasKit;
    this._pixiContainer = pixiContainer;
    this._htmlCanvas = htmlCanvas;
    this._surface = this._canvasKit.MakeSWCanvasSurface(this._htmlCanvas);
    this._canvas = this._surface?.getCanvas() ?? null;
    if (this._htmlCanvas instanceof HTMLCanvasElement) {
      this._htmlCanvas.addEventListener(
        "pointerdown",
        this._handlePointerDown.bind(this),
      );
      this._htmlCanvas.addEventListener(
        "pointerup",
        this._handlePointerUp.bind(this),
      );
    }
  }

  render(): void {
    if (this._canvas) {
      this._canvas.clear(this._canvasKit.Color(16, 16, 16, 1));
      this._renderContainer(this._pixiContainer, this._canvas);
      this._surface?.flush();
    }
  }

  makePDF(): BlobPart | undefined {
    const surface = this._canvasKit.MakeSWCanvasSurface(this._htmlCanvas);
    const canvas = surface?.getCanvas() ?? null;
    if (canvas) {
      canvas.clear(this._canvasKit.Color(16, 16, 16, 1));
      this._renderContainer(this._pixiContainer, canvas);
      return canvas.makePDF();
    }
  }

  private _handlePointerDown(event: PointerEvent): void {
    console.log(event.clientX, event.clientY);
  }

  private _handlePointerUp(event: PointerEvent): void {
    console.log(event.clientX, event.clientY);
  }

  private _renderContainer(
    container: PIXI.Container,
    canvas: SKIA.Canvas,
  ): void {
    container.children.forEach((child) => {
      canvas.save();
      this._applyTransformations(child, canvas);
      if (child instanceof PIXI.Graphics) {
        this._renderGraphics(child, canvas);
      } else if (child instanceof PIXI.Sprite) {
        this._renderSprite(child, canvas);
      } else if (child instanceof PIXI.Container) {
        this._renderContainer(child, canvas);
      }
      canvas.restore();
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

  private _renderGraphics(graphics: PIXI.Graphics, canvas: SKIA.Canvas): void {
    const graphicsDataArray = graphics.geometry.graphicsData;
    graphicsDataArray.forEach((data) => {
      const shapeType = data.shape.type;
      if (shapeType === PIXI.SHAPES.POLY) {
        this._drawPoly(data, canvas);
      } else if (shapeType === PIXI.SHAPES.RECT) {
        this._drawRect(data, canvas);
      } else if (shapeType === PIXI.SHAPES.CIRC) {
        this._drawCirc(data, canvas);
      } else if (shapeType === PIXI.SHAPES.ELIP) {
        this._drawElip(data, canvas);
      } else if (shapeType === PIXI.SHAPES.RREC) {
        this._drawRRect(data, canvas);
      }
    });
  }

  private _renderSprite(sprite: PIXI.Sprite, canvas: SKIA.Canvas): void {
    const paint = new this._canvasKit.Paint();
    const resource = sprite.texture.baseTexture.resource as PIXI.ImageResource;
    const source = resource.source as
      | HTMLImageElement
      | HTMLVideoElement
      | ImageBitmap
      | HTMLCanvasElement;
    const img = this._canvasKit.MakeImageFromCanvasImageSource(source);
    if (img) {
      canvas.drawImage(img, sprite.position.x, sprite.position.y, paint);
      img.delete();
    }
  }

  private _drawPoly(data: PIXI.GraphicsData, canvas: SKIA.Canvas): void {
    if (data.shape.type !== PIXI.SHAPES.POLY) {
      return;
    }
    const fillPaint = this._createFillPaint(data.fillStyle);
    const strokePaint = this._createStrokePaint(data.lineStyle);
    const path = new this._canvasKit.Path();
    path.moveTo(data.shape.points[0], data.shape.points[1]);
    for (let i = 2; i < data.shape.points.length; i += 2) {
      path.lineTo(data.shape.points[i], data.shape.points[i + 1]);
    }
    canvas.drawPath(path, strokePaint);
    canvas.drawPath(path, fillPaint);
    path.delete();
    fillPaint.delete();
    strokePaint.delete();
  }

  private _drawRect(data: PIXI.GraphicsData, canvas: SKIA.Canvas): void {
    if (data.shape.type !== PIXI.SHAPES.RECT) {
      return;
    }
    const fillPaint = this._createFillPaint(data.fillStyle);
    const strokePaint = this._createStrokePaint(data.lineStyle);
    const rect = this._canvasKit.XYWHRect(
      data.shape.x,
      data.shape.y,
      data.shape.width,
      data.shape.height,
    );
    canvas.drawRect(rect, fillPaint);
    canvas.drawRect(rect, strokePaint);
    fillPaint.delete();
    strokePaint.delete();
  }

  private _drawCirc(data: PIXI.GraphicsData, canvas: SKIA.Canvas): void {
    if (data.shape.type !== PIXI.SHAPES.CIRC) {
      return;
    }
    const fillPaint = this._createFillPaint(data.fillStyle);
    const strokePaint = this._createStrokePaint(data.lineStyle);
    const boundingRect = this._canvasKit.XYWHRect(
      data.shape.x - data.shape.radius,
      data.shape.y - data.shape.radius,
      data.shape.radius * 2,
      data.shape.radius * 2,
    );
    canvas.drawOval(boundingRect, fillPaint);
    canvas.drawOval(boundingRect, strokePaint);
    fillPaint.delete();
    strokePaint.delete();
  }

  private _drawElip(data: PIXI.GraphicsData, canvas: SKIA.Canvas): void {
    if (data.shape.type !== PIXI.SHAPES.ELIP) {
      return;
    }
    const fillPaint = this._createFillPaint(data.fillStyle);
    const strokePaint = this._createStrokePaint(data.lineStyle);
    const boundingRect = this._canvasKit.XYWHRect(
      data.shape.x - data.shape.width,
      data.shape.y - data.shape.height,
      data.shape.width * 2,
      data.shape.height * 2,
    );
    canvas.drawOval(boundingRect, fillPaint);
    canvas.drawOval(boundingRect, strokePaint);
  }

  private _drawRRect(data: PIXI.GraphicsData, canvas: SKIA.Canvas): void {
    if (data.shape.type !== PIXI.SHAPES.RREC) {
      return;
    }
    const fillPaint = this._createFillPaint(data.fillStyle);
    const strokePaint = this._createStrokePaint(data.lineStyle);
    const roundedRect = this._canvasKit.RRectXY(
      this._canvasKit.XYWHRect(
        data.shape.x,
        data.shape.y,
        data.shape.width,
        data.shape.height,
      ),
      data.shape.radius,
      data.shape.radius,
    );
    canvas.drawRRect(roundedRect, fillPaint);
    canvas.drawRRect(roundedRect, strokePaint);
  }

  private _createFillPaint(fillStyle: PIXI.FillStyle): SKIA.Paint {
    const paint = new this._canvasKit.Paint();
    paint.setAntiAlias(true);
    paint.setColor(this._createSkiaColor(fillStyle.color, fillStyle.alpha));
    paint.setStyle(this._canvasKit.PaintStyle.Fill);
    if (!fillStyle.visible) {
      paint.setAlphaf(0);
    }
    return paint;
  }

  private _createStrokePaint(lineStyle: PIXI.LineStyle): SKIA.Paint {
    const paint = new this._canvasKit.Paint();
    paint.setAntiAlias(true);
    paint.setStyle(this._canvasKit.PaintStyle.Stroke);
    paint.setStrokeWidth(lineStyle.width);
    paint.setColor(this._createSkiaColor(lineStyle.color, lineStyle.alpha));
    const joinMap = {
      miter: this._canvasKit.StrokeJoin.Miter,
      bevel: this._canvasKit.StrokeJoin.Bevel,
      round: this._canvasKit.StrokeJoin.Round,
    };
    paint.setStrokeJoin(
      joinMap[lineStyle.join] || this._canvasKit.StrokeJoin.Miter,
    );
    const capMap = {
      butt: this._canvasKit.StrokeCap.Butt,
      round: this._canvasKit.StrokeCap.Round,
      square: this._canvasKit.StrokeCap.Square,
    };
    paint.setStrokeCap(capMap[lineStyle.cap] || this._canvasKit.StrokeCap.Butt);
    paint.setStrokeMiter(lineStyle.miterLimit);
    if (!lineStyle.visible) {
      paint.setAlphaf(0);
    }
    return paint;
  }

  private _createSkiaColor(color: number, alpha?: number) {
    const r = (color >> 16) & 0xff;
    const g = (color >> 8) & 0xff;
    const b = color & 0xff;
    return this._canvasKit.Color(r, g, b, alpha);
  }
}
