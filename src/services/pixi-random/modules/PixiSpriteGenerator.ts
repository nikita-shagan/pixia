import * as PIXI from "pixi.js-legacy";

/**
 * Constructs a class for generating a random sprite.
 * Sprite is created based on spite sources, provided to constructor.
 * @param imagesForSprite - source array of images
 */
export class PixiSpriteGenerator {
  private readonly _imagesForSprite: PIXI.SpriteSource[] = [];

  constructor(imagesForSprite: PIXI.SpriteSource[]) {
    this._imagesForSprite = imagesForSprite;
  }

  /**
   * Returns a random Pixi Sprite.
   */
  public createRandomSprite(): PIXI.Sprite {
    return PIXI.Sprite.from(
      this._imagesForSprite[
        Math.floor(Math.random() * this._imagesForSprite.length)
      ],
    );
  }
}
