const downloadPDF = (pdfBytes: BlobPart) => {
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

export default downloadPDF;
