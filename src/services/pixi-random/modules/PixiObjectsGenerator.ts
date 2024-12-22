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
  private readonly _listenersApplier: PixiListenersApplier;

  constructor(
    imagesForSprite: Pixi.SpriteSource[],
    windowSize: { width: number; height: number },
    shapeSizeMulti: number = 50,
    scaleMulti: number = 1.1,
    spriteChance: number = 0.1,
  ) {
    this._spriteGenerator = new PixiSpriteGenerator(imagesForSprite);
    this._graphicsGenerator = new PixiGraphicsGenerator(shapeSizeMulti);
    this._objectTransformer = new PixiObjectTransformer(windowSize, scaleMulti);
    this._listenersApplier = new PixiListenersApplier();
    this._spriteChance = spriteChance;
  }

  /**
   * Returns an array of random Pixi Display Objects.
   */
  public createRandomObjects(copies: number = 1): Pixi.DisplayObject[] {
    const shouldGenerateSprite = Math.random() < this._spriteChance;
    if (shouldGenerateSprite) {
      const sprites = this._spriteGenerator.createRandomSprites(copies);
      this._listenersApplier.applyEventListeners(sprites);
      return sprites;
    }
    const graphics = this._graphicsGenerator.createRandomGraphics(copies);
    this._listenersApplier.applyEventListeners(graphics);
    this._objectTransformer.applyAllRandomTransformations(graphics);
    return graphics;
  }
}
