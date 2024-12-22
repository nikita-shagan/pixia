import * as Pixi from "pixi.js-legacy";
import { HitRegion } from "./HitRegionsManager";

/**
 * Class for applying listeners to skia canvas
 */
export class ListenersManager {
  /**
   * Adds callback to skia canvas
   * @param htmlCanvas - skia canvas element to which add listeners
   * @param eventTypes - event types, such as "pointerdown" or "pointerup"
   * @param getRegions - callback to get hit region objects
   * @param onCall - callback to process some logic after listener was called
   */
  static applyListeners(
    htmlCanvas: HTMLCanvasElement,
    eventTypes: (keyof Pixi.FederatedEventMap)[],
    getRegions: () => HitRegion[],
    onCall: () => void,
  ): void {
    if (htmlCanvas instanceof HTMLCanvasElement) {
      for (const eventType of eventTypes) {
        htmlCanvas.addEventListener(eventType, (event) =>
          this.callRegionListeners(
            event as PointerEvent,
            htmlCanvas,
            getRegions,
            onCall,
          ),
        );
      }
    }
  }

  /**
   * Calls callbacks applied to skia canvas
   * @param event - event type such as "pointerdown" or "pointerup"
   * @param htmlCanvas - to get relative mouse point
   * @param getRegions - callback to get hit region objects
   * @param onCall - callback to process some logic after listener was called
   */
  static callRegionListeners(
    event: PointerEvent,
    htmlCanvas: HTMLCanvasElement,
    getRegions: () => HitRegion[],
    onCall: () => void,
  ): void {
    const rect = htmlCanvas.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    const clickPoint = new Pixi.Point(x, y);
    const applicableRegions = getRegions().filter((region) =>
      region.shouldApplyListeners(clickPoint),
    );
    const topRegion = applicableRegions.pop();
    if (topRegion) {
      for (const listener of topRegion.listeners) {
        if (listener.type === event.type) {
          listener.callback(event as unknown as Pixi.FederatedPointerEvent);
          onCall();
        }
      }
    }
  }
}
