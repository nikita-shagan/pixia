import { RESOLUTION_THRESHOLDS } from "./constants";

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
  return { width: 300, height: 300 };
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
