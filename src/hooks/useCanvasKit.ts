import CanvasKitInit from "skia";
import * as SKIA from "skia";
import { monitorFileLoading } from "../utils/funtions";

export default async function useCanvasKit(
  onProgress?: (percent: number) => void,
): Promise<SKIA.CanvasKit> {
  try {
    let loaded = 0;
    const total = 1;
    const canvasKit = await CanvasKitInit({
      locateFile: (file) => {
        const url = `/${file}`;
        if (onProgress) {
          console.log(loaded / total);
          monitorFileLoading(url, (progress) => {
            loaded = progress;
            onProgress(Math.round((loaded / total) * 100));
          });
        }
        return url;
      },
    });

    if (onProgress) onProgress(100);
    return canvasKit;
  } catch (error) {
    console.error("Failed to initialize CanvasKit:", error);
    throw error;
  }
}
