import * as Pixi from "pixi.js-legacy";
import CanvasKitInit, { CanvasKit } from "skia";
import { PixiObjectsGenerator } from "../services/pixi-random";
import { ContainerRenderer } from "../services/skia-wrapper";
import { calculateViewWindow, downloadPDF } from "../utils/funtions";
import { CANVAS_VIEW_DEFAULT } from "../utils/constants";
import imageOne from "../assets/1.png";
import imageTwo from "../assets/2.png";
import imageThree from "../assets/3.png";

export default class App {
  private readonly _pixiApp: Pixi.Application<HTMLCanvasElement>;
  private readonly _pixiContainer: Pixi.Container;
  private readonly _canvasView = { ...CANVAS_VIEW_DEFAULT };
  private _canvasKit: CanvasKit | null = null;
  private _containerRenderer: ContainerRenderer | null = null;

  constructor() {
    this._pixiApp = this._initPixi();
    this._pixiContainer = new Pixi.Container();
    this._pixiApp.stage.addChild(this._pixiContainer);
  }

  async init() {
    try {
      this._canvasKit = await this._initCanvasKit();
      this._containerRenderer = new ContainerRenderer(
        this._canvasKit,
        this._pixiContainer,
        this._createSkiaCanvas(),
        this._canvasView.background,
      );
      this._setupEventListeners();
      this._containerRenderer.renderOnScreen();
    } catch (error) {
      console.error("Failed to initialize App:", error);
    }
  }

  private _initPixi() {
    const pixiApp = new Pixi.Application<HTMLCanvasElement>({
      resolution: 1,
      forceCanvas: true,
      ...this._canvasView,
    });
    document.getElementById("pixi-canvas-container")?.appendChild(pixiApp.view);
    return pixiApp;
  }

  private async _initCanvasKit() {
    return await CanvasKitInit({
      locateFile: (file) => `/${file}`,
    });
  }

  private _createSkiaCanvas() {
    const canvas = document.createElement("canvas");
    canvas.width = this._canvasView.width;
    canvas.height = this._canvasView.height;
    document.getElementById("skia-canvas-container")?.appendChild(canvas);
    return canvas;
  }

  private _resizeCanvas(canvases: HTMLCanvasElement[]) {
    const { innerWidth } = window;
    const newViewWindow = calculateViewWindow(innerWidth);
    if (newViewWindow.width !== this._canvasView.width) {
      this._canvasView.width = newViewWindow.width;
      this._canvasView.height = newViewWindow.height;
      canvases.forEach((canvas) => {
        if (canvas) {
          canvas.width = this._canvasView.width;
          canvas.height = this._canvasView.height;
        }
      });
      if (this._containerRenderer) {
        this._containerRenderer.renderOnScreen();
      }
    }
  }

  private _setupEventListeners() {
    const pixiCanvas = document.querySelector("#pixi-canvas-container canvas");
    const skiaCanvas = document.querySelector("#skia-canvas-container canvas");
    const pdfButton = document.getElementById("pdf-button");
    const randomGraphicButton = document.getElementById(
      "random-graphic-button",
    ) as HTMLButtonElement;
    if (
      pixiCanvas instanceof HTMLCanvasElement &&
      skiaCanvas instanceof HTMLCanvasElement
    ) {
      const canvases = [pixiCanvas, skiaCanvas];
      this._resizeCanvas(canvases);
      window.addEventListener("resize", () => this._resizeCanvas(canvases));
    }
    if (pdfButton instanceof HTMLButtonElement) {
      pdfButton.addEventListener("click", () => {
        const pdfBytes = this._containerRenderer?.renderOnPDF();
        if (pdfBytes) {
          downloadPDF(pdfBytes);
        }
      });
    }
    const pixiObjectGenerator = new PixiObjectsGenerator(
      [imageOne, imageTwo, imageThree],
      { width: this._canvasView.width, height: this._canvasView.height },
    );
    if (randomGraphicButton instanceof HTMLButtonElement) {
      randomGraphicButton.addEventListener("click", () => {
        const randomObject = pixiObjectGenerator.createRandomObject();
        this._pixiContainer.addChild(randomObject);
        if (this._containerRenderer) {
          this._containerRenderer.renderOnScreen(); // Safely access the renderer
        } else {
          console.error("ContainerRenderer is not initialized.");
        }
      });
    }
  }
}
