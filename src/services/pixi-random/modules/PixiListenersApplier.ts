import * as Pixi from "pixi.js-legacy";

/**
 * A class for applying pointerdown and pointerup test listeners.
 */
export class PixiListenersApplier {
  /**
   * Applies hardcoded pointerdown and pointerup listeners to display objects.
   * @param displayObjects Pixi.DisplayObjects array to transform
   */
  public applyEventListeners(displayObjects: Pixi.DisplayObject[]): void {
    displayObjects.forEach((displayObject) => {
      displayObject.eventMode = "dynamic";
      displayObject.on("pointerdown", () => {
        displayObject.scale.set(
          displayObject.scale.x * 1.1,
          displayObject.scale.y * 1.1,
        );
      });
      displayObject.on("pointerup", () => {
        displayObject.scale.set(
          displayObject.scale.x / 1.1,
          displayObject.scale.y / 1.1,
        );
      });
    });
  }
}
