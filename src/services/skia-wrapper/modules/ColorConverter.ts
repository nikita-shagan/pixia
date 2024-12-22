import * as SKIA from "skia";

/**
 * Class for color converting.
 */
export class ColorConverter {
  /**
   * Converts PIXI color number or string to Skia color object
   * @param canvasKit skia wasm canvas kit
   * @param color in decimal or hex format
   * @param alpha transparency of a new color
   * @return SKIA.Color object
   */
  public static convertColor(
    canvasKit: SKIA.CanvasKit,
    color: number | string,
    alpha?: number | undefined,
  ): SKIA.Color {
    let numColor: number;
    if (typeof color === "string") {
      numColor = parseInt(color[0] === "#" ? color.slice(1) : color, 16);
    } else {
      numColor = color;
    }
    const r = (numColor >> 16) & 0xff;
    const g = (numColor >> 8) & 0xff;
    const b = numColor & 0xff;
    return canvasKit.Color(r, g, b, alpha);
  }
}
