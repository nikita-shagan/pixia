import * as PIXI from "pixi.js-legacy";
import * as SKIA from "skia";
import { StyleConverter } from "./StyleConverter";
import { ShapeConverter } from "./ShapeConverter";

export class GraphicsRenderer {
  static render(
    canvasKit: SKIA.CanvasKit,
    canvas: SKIA.Canvas,
    graphics: PIXI.Graphics,
  ): void {
    const graphicsDataArray = graphics.geometry.graphicsData;
    graphicsDataArray.forEach((data) => {
      this.renderGraphicsData(canvasKit, canvas, data);
    });
  }

  static renderGraphicsData(
    canvasKit: SKIA.CanvasKit,
    canvas: SKIA.Canvas,
    data: PIXI.GraphicsData,
  ) {
    const fillPaint = StyleConverter.convertFillStyle(
      canvasKit,
      data.fillStyle,
    );
    const strokePaint = StyleConverter.convertLineStyle(
      canvasKit,
      data.lineStyle,
    );
    if (data.shape.type === PIXI.SHAPES.POLY) {
      const path = ShapeConverter.convertPolygon(canvasKit, data.shape);
      canvas.drawPath(path, fillPaint);
      canvas.drawPath(path, strokePaint);
    } else if (data.shape.type === PIXI.SHAPES.RECT) {
      const rect = ShapeConverter.convertRect(canvasKit, data.shape);
      canvas.drawRect(rect, fillPaint);
      canvas.drawRect(rect, strokePaint);
    } else if (data.shape.type === PIXI.SHAPES.CIRC) {
      const oval = ShapeConverter.convertCirc(canvasKit, data.shape);
      canvas.drawOval(oval, fillPaint);
      canvas.drawOval(oval, strokePaint);
    } else if (data.shape.type === PIXI.SHAPES.ELIP) {
      const oval = ShapeConverter.convertElip(canvasKit, data.shape);
      canvas.drawOval(oval, fillPaint);
      canvas.drawOval(oval, strokePaint);
    } else if (data.shape.type === PIXI.SHAPES.RREC) {
      const rrect = ShapeConverter.convertRRect(canvasKit, data.shape);
      canvas.drawRRect(rrect, fillPaint);
      canvas.drawRRect(rrect, strokePaint);
    }
    fillPaint.delete();
    strokePaint.delete();
  }
}
