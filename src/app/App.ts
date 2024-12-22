import { createElement, downloadPDF } from "../utils/funtions";
import Button from "../components/Button/Button";
import CanvasContainer from "../components/CanvasContainer/CanvasContainer";
import Views from "../components/Views/Views";
import Controls from "../components/Controls/Controls";
import usePixiApp from "../hooks/usePixiApp";
import useSkiaWrapper from "../hooks/useSkiaWrapper";
import useCanvasKit from "../hooks/useCanvasKit";
import useViewWindow from "../hooks/useViewWindow";
import useRandomObjectsGenerator from "../hooks/useRandomObjectsGenerator";
import "./App.css";

export default async function App(): Promise<HTMLElement> {
  const canvasKit = await useCanvasKit();
  const viewWindow = useViewWindow();
  const { pixiApp, pixiTopContainer } = usePixiApp(viewWindow);
  const { pixiTopContainer: virtualPixiTopContainer } = usePixiApp(viewWindow);
  const { skiaRenderer, skiaCanvas } = await useSkiaWrapper(
    virtualPixiTopContainer,
    canvasKit,
    viewWindow,
  );
  const randomObjectsGenerator = useRandomObjectsGenerator(viewWindow);

  const handleAddObjectClick = () => {
    const [o1, o2] = randomObjectsGenerator.createRandomObjects(2);
    virtualPixiTopContainer.addChild(o1);
    pixiTopContainer.addChild(o2);
    skiaRenderer.renderOnScreen();
  };

  const handleExportPdfClick = () => {
    const pdfBytes = skiaRenderer.renderOnPDF();
    if (pdfBytes) downloadPDF(pdfBytes);
  };

  const handleClearClick = () => {
    pixiTopContainer.removeChildren();
    virtualPixiTopContainer.removeChildren();
    skiaRenderer.renderOnScreen();
  };

  skiaRenderer.renderOnScreen();

  return createElement(
    "div",
    { id: "app" },
    Controls({
      children: [
        Button({ onClick: handleAddObjectClick, text: "Добавить объект" }),
        Button({ onClick: handleExportPdfClick, text: "Экспорт в ПДФ" }),
        Button({ onClick: handleClearClick, text: "Очистить" }),
      ],
    }),
    Views({
      children: [
        CanvasContainer({ canvas: pixiApp.view }),
        CanvasContainer({ canvas: skiaCanvas }),
      ],
    }),
  );
}
