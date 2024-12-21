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
   * @param displayObject - pixi display object to transform
   */
  public applyAllRandomTransformations(
    displayObject: PIXI.DisplayObject,
  ): void {
    this.applyRandomRotation(displayObject);
    this.applyRandomPosition(displayObject);
    this.applyRandomScale(displayObject);
  }

  /**
   * Applies a random rotation  to display object
   * @param displayObject - pixi display object to rotate
   */
  public applyRandomRotation(displayObject: PIXI.DisplayObject): void {
    displayObject.angle = Math.random() * 360;
  }

  /**
   * Applies a random position to display object
   * @param displayObject - pixi display object to reposition
   */
  public applyRandomPosition(displayObject: PIXI.DisplayObject): void {
    displayObject.position.set(
      Math.random() * this._windowSize.width,
      Math.random() * this._windowSize.height,
    );
  }

  /**
   * Applies a random scale to display object
   * @param displayObject - pixi display object to scale
   */
  public applyRandomScale(displayObject: PIXI.DisplayObject): void {
    displayObject.scale.set(
      Math.random() * this._scaleMulti + 0.5,
      Math.random() * this._scaleMulti + 0.5,
    );
  }
}
