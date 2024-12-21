import * as PIXI from "pixi.js-legacy";

/**
 * Constructs a class for generating a random graphics.
 * @param shapeSizeMultiplier - number for adjusting graphics size
 */
export class PixiGraphicsGenerator {
  private readonly _shapeSizeMulti: number;

  constructor(shapeSizeMultiplier: number) {
    this._shapeSizeMulti = shapeSizeMultiplier;
  }

  /**
   * Returns a random Pixi Graphics.
   */
  public createRandomGraphics(): PIXI.Graphics {
    const g = new PIXI.Graphics();
    const strokeColor = Math.floor(Math.random() * 0xffffff);
    const strokeWidth = Math.random() * 5 + 1;
    const randomColor = Math.floor(Math.random() * 0xffffff);
    const randomAlpha = (Math.random() + 1) / 2;
    g.lineStyle(strokeWidth, strokeColor, randomAlpha);
    g.beginFill(randomColor, randomAlpha);
    const shapeType = +Object.keys(PIXI.SHAPES)[Math.floor(Math.random() * 5)];
    console.log(PIXI.SHAPES[shapeType]);
    if (shapeType === PIXI.SHAPES.CIRC) {
      g.drawShape(this._createRandomCircle());
    } else if (shapeType === PIXI.SHAPES.RECT) {
      g.drawShape(this._createRandomRectangle());
    } else if (shapeType === PIXI.SHAPES.RREC) {
      g.drawShape(this._createRandomRoundedRectangle());
    } else if (shapeType === PIXI.SHAPES.ELIP) {
      g.drawShape(this._createRandomEllipse());
    } else if (shapeType === PIXI.SHAPES.POLY) {
      if (Math.random() > 0.5) {
        g.drawShape(this._createRandomPolygon());
      } else {
        g.drawShape(this._createRandomLine());
      }
    }
    g.endFill();
    return g;
  }

  private _createRandomCircle(): PIXI.Circle {
    const radius = Math.random() * this._shapeSizeMulti + 20;
    return new PIXI.Circle(0, 0, radius);
  }

  private _createRandomRectangle(): PIXI.Rectangle {
    const width = Math.random() * this._shapeSizeMulti + 30;
    const height = Math.random() * this._shapeSizeMulti + 30;
    return new PIXI.Rectangle(0, 0, width, height);
  }

  private _createRandomRoundedRectangle(): PIXI.RoundedRectangle {
    const width = Math.random() * this._shapeSizeMulti + 30;
    const height = Math.random() * this._shapeSizeMulti + 30;
    const radius = (Math.random() * this._shapeSizeMulti) / 2;
    return new PIXI.RoundedRectangle(0, 0, width, height, radius);
  }

  private _createRandomEllipse(): PIXI.Ellipse {
    const halfWidth = (Math.random() * this._shapeSizeMulti) / 2 + 30;
    const halfHeight = (Math.random() * this._shapeSizeMulti) / 2 + 30;
    return new PIXI.Ellipse(0, 0, halfWidth, halfHeight);
  }

  private _createRandomPolygon(): PIXI.Polygon {
    const sides = Math.floor(Math.random() * 5 + 2);
    const radius = Math.random() * this._shapeSizeMulti + 30;
    const points: number[] = [];
    for (let i = 0; i < sides; i++) {
      const angle = (i * 2 * Math.PI) / sides;
      points.push(Math.cos(angle) * radius);
      points.push(Math.sin(angle) * radius);
    }
    return new PIXI.Polygon(points);
  }

  private _createRandomLine(): PIXI.Polygon {
    const sides = Math.floor(Math.random() * 5 + 2);
    const radius = Math.random() * this._shapeSizeMulti + 30;
    const points: number[] = [];
    let angleOffset = Math.random() * Math.PI * 2;
    for (let i = 0; i < sides; i++) {
      const angle = angleOffset + Math.random() * Math.PI;
      const r = radius * (0.5 + Math.random());
      points.push(Math.cos(angle) * r);
      points.push(Math.sin(angle) * r);
      angleOffset += Math.random() * Math.PI * 0.5;
    }
    return new PIXI.Polygon(points);
  }
}
