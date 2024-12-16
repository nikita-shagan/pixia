import * as PIXI from "pixi.js-legacy";
import * as SKIA from "skia";

export default class SkiaWrapper {
  private canvasKit: SKIA.CanvasKit;
  private commandsForPDF: string[];

  constructor(canvasKit: SKIA.CanvasKit) {
    this.canvasKit = canvasKit;
    this.commandsForPDF = [];
  }

  render(
    container: PIXI.Container,
    htmlCanvas: string | HTMLCanvasElement,
  ): void {
    const surface = this.canvasKit.MakeSWCanvasSurface(htmlCanvas);
    if (surface) {
      const canvas = surface.getCanvas();
      canvas.clear(this.canvasKit.Color(0, 0, 0, 1));
      this.renderContainer(container, canvas);
      surface.flush();
    }
  }

  generatePDF(): BlobPart {
    return this.canvasKit._drawPDF(this.commandsForPDF.join());
  }

  private renderContainer(
    container: PIXI.Container,
    canvas: SKIA.Canvas,
  ): void {
    container.children.forEach((child) => {
      canvas.save();
      this.applyTransformations(child, canvas);
      if (child instanceof PIXI.Graphics) {
        this.renderGraphics(child, canvas);
      } else if (child instanceof PIXI.Sprite) {
        this.renderSprite(child, canvas);
      } else if (child instanceof PIXI.Container) {
        this.renderContainer(child, canvas);
      }
      canvas.restore();
    });
  }

  private applyTransformations(
    displayObject: PIXI.DisplayObject,
    canvas: SKIA.Canvas,
  ): void {
    canvas.translate(displayObject.position.x, displayObject.position.y);
    canvas.rotate(displayObject.angle, 0, 0);
    canvas.scale(displayObject.scale.x, displayObject.scale.y);
  }

  private renderGraphics(graphics: PIXI.Graphics, canvas: SKIA.Canvas): void {
    const graphicsDataArray = graphics.geometry.graphicsData;
    graphicsDataArray.forEach((data) => {
      const shapeType = data.shape.type;
      if (shapeType === PIXI.SHAPES.POLY) {
        this.drawPoly(data, canvas);
      } else if (shapeType === PIXI.SHAPES.RECT) {
        this.drawRect(data, canvas);
      } else if (shapeType === PIXI.SHAPES.CIRC) {
        this.drawCirc(data, canvas);
      } else if (shapeType === PIXI.SHAPES.ELIP) {
        this.drawElip(data, canvas);
      } else if (shapeType === PIXI.SHAPES.RREC) {
        this.drawRRect(data, canvas);
      }
    });
  }

  private renderSprite(sprite: PIXI.Sprite, canvas: SKIA.Canvas): void {
    const paint = new this.canvasKit.Paint();
    const resource = sprite.texture.baseTexture.resource as PIXI.ImageResource;
    const source = resource.source as
      | HTMLImageElement
      | HTMLVideoElement
      | ImageBitmap
      | HTMLCanvasElement;
    const img = this.canvasKit.MakeImageFromCanvasImageSource(source);
    if (img) {
      canvas.drawImageRect(
        img,
        [0, 0, sprite.width, sprite.height],
        [
          sprite.position.x,
          sprite.position.y,
          sprite.position.x + sprite.width,
          sprite.position.y + sprite.height,
        ],
        paint,
      );
      img.delete();
    }
  }

  private drawPoly(data: PIXI.GraphicsData, canvas: SKIA.Canvas): void {
    if (data.shape.type !== PIXI.SHAPES.POLY) {
      return;
    }
    const fillPaint = this.createFillPaint(data.fillStyle);
    const strokePaint = this.createStrokePaint(data.lineStyle);
    const path = new this.canvasKit.Path();
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

  private drawRect(data: PIXI.GraphicsData, canvas: SKIA.Canvas): void {
    if (data.shape.type !== PIXI.SHAPES.RECT) {
      return;
    }
    const fillPaint = this.createFillPaint(data.fillStyle);
    const strokePaint = this.createStrokePaint(data.lineStyle);
    const rect = this.canvasKit.XYWHRect(
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

  private drawCirc(data: PIXI.GraphicsData, canvas: SKIA.Canvas): void {
    if (data.shape.type !== PIXI.SHAPES.CIRC) {
      return;
    }
    const fillPaint = this.createFillPaint(data.fillStyle);
    const strokePaint = this.createStrokePaint(data.lineStyle);
    const boundingRect = this.canvasKit.XYWHRect(
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

  private drawElip(data: PIXI.GraphicsData, canvas: SKIA.Canvas): void {
    if (data.shape.type !== PIXI.SHAPES.ELIP) {
      return;
    }
    const fillPaint = this.createFillPaint(data.fillStyle);
    const strokePaint = this.createStrokePaint(data.lineStyle);
    const boundingRect = this.canvasKit.XYWHRect(
      data.shape.x - data.shape.width,
      data.shape.y - data.shape.height,
      data.shape.width * 2,
      data.shape.height * 2,
    );
    canvas.drawOval(boundingRect, fillPaint);
    canvas.drawOval(boundingRect, strokePaint);
  }

  private drawRRect(data: PIXI.GraphicsData, canvas: SKIA.Canvas): void {
    if (data.shape.type !== PIXI.SHAPES.RREC) {
      return;
    }
    const fillPaint = this.createFillPaint(data.fillStyle);
    const strokePaint = this.createStrokePaint(data.lineStyle);
    const roundedRect = this.canvasKit.RRectXY(
      this.canvasKit.XYWHRect(
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

  private createFillPaint(fillStyle: PIXI.FillStyle): SKIA.Paint {
    const paint = new this.canvasKit.Paint();
    paint.setAntiAlias(true);
    paint.setColor(this.createSkiaColor(fillStyle.color, fillStyle.alpha));
    paint.setStyle(this.canvasKit.PaintStyle.Fill);
    if (!fillStyle.visible) {
      paint.setAlphaf(0);
    }
    return paint;
  }

  private createStrokePaint(lineStyle: PIXI.LineStyle): SKIA.Paint {
    const paint = new this.canvasKit.Paint();
    paint.setAntiAlias(true);
    paint.setStyle(this.canvasKit.PaintStyle.Stroke);
    paint.setStrokeWidth(lineStyle.width);
    paint.setColor(this.createSkiaColor(lineStyle.color, lineStyle.alpha));
    const joinMap = {
      miter: this.canvasKit.StrokeJoin.Miter,
      bevel: this.canvasKit.StrokeJoin.Bevel,
      round: this.canvasKit.StrokeJoin.Round,
    };
    paint.setStrokeJoin(
      joinMap[lineStyle.join] || this.canvasKit.StrokeJoin.Miter,
    );
    const capMap = {
      butt: this.canvasKit.StrokeCap.Butt,
      round: this.canvasKit.StrokeCap.Round,
      square: this.canvasKit.StrokeCap.Square,
    };
    paint.setStrokeCap(capMap[lineStyle.cap] || this.canvasKit.StrokeCap.Butt);
    paint.setStrokeMiter(lineStyle.miterLimit);
    if (!lineStyle.visible) {
      paint.setAlphaf(0);
    }
    return paint;
  }

  private createSkiaColor(color: number, alpha?: number) {
    const r = (color >> 16) & 0xff;
    const g = (color >> 8) & 0xff;
    const b = color & 0xff;
    return this.canvasKit.Color(r, g, b, alpha);
  }
}
