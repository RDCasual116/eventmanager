const fs = require("fs");
const PDFDocument = require("pdfkit");

/**
 * Function to generate a certificate
 * @param {string} templatePath - Path to the template image (e.g., PNG/JPG)
 * @param {Object} details - Object containing certificate details
 * @param {string} outputPath - Path to save the generated PDF
 */
function generateCertificate(templatePath, details, outputPath) {
  // Create a new PDF document
  const doc = new PDFDocument({
    size: "A4",
    layout: "landscape",
  });

  // Pipe the document to a writable stream
  const stream = fs.createWriteStream(outputPath);
  doc.pipe(stream);

  // Add the certificate background
  doc.image(templatePath, 0, 0, { width: doc.page.width, height: doc.page.height });

  // Add certificate details
  doc.fontSize(32)
    .font("Helvetica-Bold")
    .fillColor("#333")
    .text(details.name, 100, 250, { align: "center", width: doc.page.width - 200 });

  doc.fontSize(20)
    .font("Helvetica")
    .fillColor("#555")
    .text(`Awarded for: ${details.award}`, 100, 300, { align: "center", width: doc.page.width - 200 });

  doc.fontSize(18)
    .font("Helvetica")
    .fillColor("#666")
    .text(`Date: ${details.date}`, 100, 350, { align: "center", width: doc.page.width - 200 });

  // Finalize the PDF
  doc.end();

  // Return a promise that resolves when the PDF is written
  return new Promise((resolve, reject) => {
    stream.on("finish", () => resolve(outputPath));
    stream.on("error", reject);
  });
}

// Example Usage
const templatePath = "./template.png"; // Replace with your certificate template path
const details = {
  name: "John Doe",
  award: "Best Participant",
  date: "21st December 2024",
};
const outputPath = "./certificate.pdf";

generateCertificate(templatePath, details, outputPath)
  .then((path) => {
    console.log(`Certificate saved at: ${path}`);
  })
  .catch((error) => {
    console.error("Error generating certificate:", error);
  });
