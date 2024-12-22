import CanvasKitInit from "skia";
import * as SKIA from "skia";

export default async function useCanvasKit(): Promise<SKIA.CanvasKit> {
  return await CanvasKitInit({
    locateFile: (file) => `/${file}`,
  });
}
