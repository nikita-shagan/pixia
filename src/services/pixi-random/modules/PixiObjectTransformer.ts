import * as PIXI from "pixi.js-legacy";

/**
 * Constructs a class for transforming a pixi display object.
 * @param windowSize - bounds for position of a new graphic
 * @param scaleMulti - number for adjusting scale
 */
export class PixiObjectTransformer {
  private readonly _windowSize: { width: number; height: number };
  private readonly _scaleMulti: number;

  constructor(
    windowSize: { width: number; height: number },
    scaleMulti: number = 1.1,
  ) {
    this._windowSize = windowSize;
    this._scaleMulti = scaleMulti;
  }

  /**
   * Applies random rotation, position and scale to display object
   * @param displayObjects - pixi display objects to transform
   */
  public applyAllRandomTransformations(
    displayObjects: PIXI.DisplayObject[],
  ): void {
    const randomPosition = this.getRandomPosition();
    const randomRotation = this.getRandomRotation();
    const randomScale = this.getRandomScale();
    displayObjects.forEach((displayObject) => {
      displayObject.position.set(randomPosition.x, randomPosition.y);
      displayObject.rotation = randomRotation;
      displayObject.scale.set(randomScale.x, randomScale.y);
    });
  }

  /**
   * Creates a random rotation
   * @return random angle from 0 to 360
   */
  public getRandomRotation(): number {
    return Math.random() * 360;
  }

  /**
   * Creates a random position
   * @return random position { x: number, y: number }
   */
  public getRandomPosition(): {
    x: number;
    y: number;
  } {
    return {
      x: Math.random() * this._windowSize.width,
      y: Math.random() * this._windowSize.height,
    };
  }

  /**
   * Creates a random scale
   * @return random scale { x: number, y: number }
   */
  public getRandomScale(): {
    x: number;
    y: number;
  } {
    return {
      x: Math.random() * this._scaleMulti + 0.5,
      y: Math.random() * this._scaleMulti + 0.5,
    };
  }
}
