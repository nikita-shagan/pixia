import * as PIXI from "pixi.js-legacy";

/**
 * Constructs a class for generating a random sprite.
 * Sprite is created based on spite sources, provided to constructor.
 * @param images - source array of images
 */
export class PixiSpriteGenerator {
  private readonly _images: PIXI.SpriteSource[] = [];

  constructor(images: PIXI.SpriteSource[]) {
    this._images = images;
  }

  /**
   * Returns a random Pixi Sprite.
   */
  public createRandomSprites(copies: number): PIXI.Sprite[] {
    const randomIndex = Math.floor(Math.random() * this._images.length);
    const source = this._images[randomIndex];
    const res: PIXI.Sprite[] = [];
    for (let i = 0; i < copies; i++) {
      res.push(PIXI.Sprite.from(source));
    }
    return res;
  }
}
