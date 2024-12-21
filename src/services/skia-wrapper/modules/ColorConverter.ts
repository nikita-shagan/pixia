import * as SKIA from "skia";

export class ColorConverter {
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
