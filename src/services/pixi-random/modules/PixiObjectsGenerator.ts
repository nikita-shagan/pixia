import * as Pixi from "pixi.js-legacy";
import { PixiSpriteGenerator } from "./PixiSpriteGenerator";
import { PixiGraphicsGenerator } from "./PixiGraphicsGenerator";
import { PixiObjectTransformer } from "./PixiObjectTransformer";
import { PixiListenersApplier } from "./PixiListenersApplier";

/**
 * Constructs a class for generating a random display object.
 * @param imagesForSprite - source array of images
 * @param windowSize - bounds for position of a new graphic
 * @param shapeSizeMulti - number for adjusting graphics size
 * @param scaleMulti - number for adjusting scale
 * @param spriteChance - probability of generating sprite, rest goes to graphics
 */
export class PixiObjectsGenerator {
  private readonly _spriteGenerator: PixiSpriteGenerator;
  private readonly _graphicsGenerator: PixiGraphicsGenerator;
  private readonly _objectTransformer: PixiObjectTransformer;
  private readonly _spriteChance: number;

  constructor(
    imagesForSprite: Pixi.SpriteSource[],
    windowSize: { width: number; height: number },
    shapeSizeMulti: number = 50,
    scaleMulti: number = 1.1,
    spriteChance: number = 0,
  ) {
    this._spriteGenerator = new PixiSpriteGenerator(imagesForSprite);
    this._graphicsGenerator = new PixiGraphicsGenerator(shapeSizeMulti);
    this._objectTransformer = new PixiObjectTransformer(windowSize, scaleMulti);
    this._spriteChance = spriteChance;
  }

  /**
   * Returns a random Pixi Display Object.
   */
  public createRandomObject(): Pixi.DisplayObject {
    let object: Pixi.DisplayObject;
    const shouldGenerateSprite = Math.random() < this._spriteChance;
    if (shouldGenerateSprite) {
      object = this._spriteGenerator.createRandomSprite();
    } else {
      object = this._graphicsGenerator.createRandomGraphics();
    }
    this._objectTransformer.applyAllRandomTransformations(object);
    PixiListenersApplier.applyEventListeners(object);
    return object;
  }
}
