import * as PIXI from "pixi.js-legacy";
import * as SKIA from "skia";

export class ShapeConverter {
  static convertPolygon(
    canvasKit: SKIA.CanvasKit,
    shape: PIXI.Polygon,
  ): SKIA.Path {
    const path = new canvasKit.Path();
    path.moveTo(shape.points[0], shape.points[1]);
    for (let i = 2; i < shape.points.length; i += 2) {
      path.lineTo(shape.points[i], shape.points[i + 1]);
    }
    path.close();
    return path;
  }

  static convertRect(
    canvasKit: SKIA.CanvasKit,
    shape: PIXI.Rectangle,
  ): SKIA.RRect {
    return canvasKit.XYWHRect(shape.x, shape.y, shape.width, shape.height);
  }

  static convertCirc(
    canvasKit: SKIA.CanvasKit,
    shape: PIXI.Circle,
  ): SKIA.RRect {
    return canvasKit.XYWHRect(
      shape.x - shape.radius,
      shape.y - shape.radius,
      shape.radius * 2,
      shape.radius * 2,
    );
  }

  static convertElip(
    canvasKit: SKIA.CanvasKit,
    shape: PIXI.Ellipse,
  ): SKIA.RRect {
    return canvasKit.XYWHRect(
      shape.x - shape.width,
      shape.y - shape.height,
      shape.width * 2,
      shape.height * 2,
    );
  }

  static convertRRect(
    canvasKit: SKIA.CanvasKit,
    shape: PIXI.RoundedRectangle,
  ): SKIA.RRect {
    return canvasKit.RRectXY(
      canvasKit.XYWHRect(shape.x, shape.y, shape.width, shape.height),
      shape.radius,
      shape.radius,
    );
  }
}
