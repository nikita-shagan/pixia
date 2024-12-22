import { RESOLUTION_THRESHOLDS } from "./constants";

export function createElement(
  tag: string,
  props: Record<
    string,
    string | number | boolean | ((event: Event) => void)
  > = {},
  ...children: (HTMLElement | string)[]
): HTMLElement {
  const element = document.createElement(tag);

  Object.entries(props).forEach(([key, value]) => {
    if (key.startsWith("on") && typeof value === "function") {
      const event = key.slice(2).toLowerCase();
      element.addEventListener(event, value);
    } else if (key === "className") {
      element.className = value as string;
    } else {
      console.log(key, value);
      element.setAttribute(key, String(value));
    }
  });

  children.forEach((child) => {
    if (typeof child === "string") {
      element.appendChild(document.createTextNode(child));
    } else {
      element.appendChild(child);
    }
  });

  return element;
}

export const calculateViewWindow = (width: number) => {
  if (width > RESOLUTION_THRESHOLDS.LARGE) {
    return { width: 600, height: 500 };
  }
  if (width > RESOLUTION_THRESHOLDS.MEDIUM) {
    return { width: 450, height: 350 };
  }
  if (width > RESOLUTION_THRESHOLDS.SMALL) {
    return { width: 300, height: 200 };
  }
  return { width: 300, height: 200 };
};

export const downloadPDF = (pdfBytes: BlobPart) => {
  const pdfBlob = new Blob([pdfBytes], { type: "application/pdf" });
  const pdfUrl = URL.createObjectURL(pdfBlob);
  const downloadLink = document.createElement("a");
  downloadLink.href = pdfUrl;
  downloadLink.download = "output.pdf";
  document.body.appendChild(downloadLink);
  downloadLink.click();
  document.body.removeChild(downloadLink);
  URL.revokeObjectURL(pdfUrl);
};
