import * as PIXI from "pixi.js-legacy";
import * as SKIA from "skia";

/**
 * Class for converting PIXI shapes to skia objects.
 */
export class ShapeConverter {
  /**
   * Converts PIXI.Polygon to SKIA.Path
   * @param canvasKit skia wasm canvas kit
   * @param shape PIXI.Polygon object
   * @return SKIA.Path object
   */
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

  /**
   * Converts PIXI.Rectangle to SKIA.RRect
   * @param canvasKit skia wasm canvas kit
   * @param shape PIXI.Rectangle object
   * @return SKIA.RRect object
   */
  static convertRect(
    canvasKit: SKIA.CanvasKit,
    shape: PIXI.Rectangle,
  ): SKIA.RRect {
    return canvasKit.XYWHRect(shape.x, shape.y, shape.width, shape.height);
  }

  /**
   * Converts PIXI.Circle to SKIA.RRect
   * @param canvasKit skia wasm canvas kit
   * @param shape PIXI.Circle object
   * @return SKIA.RRect object
   */
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

  /**
   * Converts PIXI.Ellipse to SKIA.RRect
   * @param canvasKit skia wasm canvas kit
   * @param shape PIXI.Ellipse object
   * @return SKIA.RRect object
   */
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

  /**
   * Converts PIXI.RoundedRectangle to SKIA.RRect
   * @param canvasKit skia wasm canvas kit
   * @param shape PIXI.RoundedRectangle object
   * @return SKIA.RRect object
   */
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
